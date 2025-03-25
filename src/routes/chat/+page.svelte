<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { user } from "$lib/auth";
  import { goto } from "$app/navigation";

  let currentUser: {
    firstName: string;
    lastName: string;
    username: string;
    id?: number;
  } | null = null;
  const unsubscribe = user.subscribe((value) => {
    // Preserve the ID if we already have it but the new value doesn't
    if (value && currentUser && currentUser.id && !value.id) {
      value.id = currentUser.id;
    }
    currentUser = value;
    console.log("Current user updated:", currentUser);
  });

  let topic = "";
  let group = "";
  let users: { id: string; name: string }[] = [];
  let messages: {
    id: number;
    user: string;
    text: string;
    timestamp?: string;
  }[] = [];
  let newMessage = "";
  let socket: WebSocket;
  let isConnected = false;

  // Load chat history from the backend
  async function loadChatHistory() {
    try {
      if (!topic || !group) return;

      // Match your backend endpoint exactly as defined in your ChatroomController
      const response = await fetch(
        `/api/chatroom/history?topic=${encodeURIComponent(topic)}&groupId=${encodeURIComponent(group)}`,
      );

      if (response.ok) {
        const chatHistory = await response.json();
        // Format the messages to match our expected structure
        messages = chatHistory.map((msg: any) => ({
          id: msg.id || Date.now() + Math.random(),
          user: msg.username || msg.user,
          text: msg.content || msg.text,
          timestamp: msg.timestamp || msg.sentAt,
        }));

        // Scroll to bottom after history is loaded
        setTimeout(scrollToBottom, 100);
      } else {
        console.error("Failed to load chat history:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }

  // Fetch the current user's group
  async function fetchUserGroup() {
    if (!currentUser || !currentUser.id) {
      console.error("Cannot fetch user group: User ID is not available");
      return null;
    }

    try {
      // Using your EmbeddingController endpoint to get groups
      const response = await fetch(`/api/groups?threshold=0.85`);

      if (!response.ok) {
        console.error("Failed to fetch user groups:", response.statusText);
        return null;
      }

      const groupsData = await response.json();
      console.log("Groups data:", groupsData);

      // Find the group that contains the current user
      const userGroup = groupsData.find((group) =>
        group.users.some(
          (user) =>
            user.id === currentUser!.id || user.userId === currentUser!.id,
        ),
      );

      if (userGroup) {
        console.log("Found user group:", userGroup);
        return userGroup.groupId || userGroup.id;
      } else {
        console.warn("User not found in any group, using default");
        return "default";
      }
    } catch (error) {
      console.error("Error fetching user group:", error);
      return null;
    }
  }

  // Function to initialize the WebSocket connection
  async function initWebSocket() {
    // Get topic from URL or use default
    const urlParams = new URLSearchParams(window.location.search);
    topic = urlParams.get("topic") || "general";

    // Try to fetch the user's group from the backend
    const userGroup = await fetchUserGroup();
    group = userGroup || urlParams.get("group") || "default";

    console.log(`Connecting to chatroom: Topic=${topic}, Group=${group}`);

    // First load chat history
    loadChatHistory();

    // Connect to WebSocket with topic and group parameters
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}/ws?topic=${encodeURIComponent(topic)}&groupId=${encodeURIComponent(group)}`;

    console.log("Connecting to WebSocket:", wsUrl);
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      isConnected = true;

      // Notify the server that the user has joined
      socket.send(
        JSON.stringify({
          type: "join",
          user: currentUser!.username,
          userId: currentUser?.id,
          groupId: group,
          topic: topic,
        }),
      );
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);

      try {
        const data = JSON.parse(event.data);

        if (data.type === "onlineUsers") {
          // Update the online users list
          users = data.users;
          console.log("Updated online users:", users);
        } else if (data.type === "chatMessage") {
          // Add the new message to our messages array
          messages = [
            ...messages,
            {
              id: data.message.id,
              user: data.message.user,
              text: data.message.text,
              timestamp: data.message.timestamp,
            },
          ];

          // Scroll to bottom when new message arrives
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      isConnected = false;
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      isConnected = false;

      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (!isConnected) {
          console.log("Attempting to reconnect WebSocket...");
          initWebSocket();
        }
      }, 3000);
    };
  }

  function scrollToBottom() {
    const chatArea = document.getElementById("chatArea");
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }

  onMount(() => {
    // Check if there's a saved username in sessionStorage
    const savedUsername = sessionStorage.getItem("username");
    const savedUserId = sessionStorage.getItem("userId");

    // If we have a saved userId but not in the currentUser, add it
    if (savedUserId && currentUser && !currentUser.id) {
      currentUser.id = parseInt(savedUserId);
    }

    // If neither currentUser nor a saved username exist, redirect to login
    if (!currentUser && !savedUsername) {
      console.log("No user found, redirecting to login");
      goto("/login");
      return;
    }

    // If a username exists in sessionStorage but currentUser isn't set yet,
    // wait briefly for auto-login to complete
    if (savedUsername && !currentUser) {
      console.log("Found saved username, waiting for auto-login");
      setTimeout(() => {
        if (!currentUser) {
          console.log("Auto-login failed, redirecting to login");
          goto("/login");
        } else {
          console.log("Auto-login succeeded, initializing WebSocket");
          initWebSocket();
        }
      }, 500); // Adjust the delay as needed
    } else {
      console.log("User already available, initializing WebSocket");
      initWebSocket();
    }
  });

  onDestroy(() => {
    // Clean up WebSocket connection when component is destroyed
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    unsubscribe();
  });

  function sendMessage() {
    if (newMessage.trim() === "" || !isConnected) return;

    const messagePayload = {
      type: "chatMessage",
      message: {
        id: Date.now(), // Temporary ID, server may replace
        user: currentUser!.username,
        userId: currentUser?.id,
        text: newMessage,
        groupId: group,
        topic: topic,
      },
    };

    try {
      socket.send(JSON.stringify(messagePayload));
      newMessage = "";
    } catch (error) {
      console.error("Error sending message:", error);

      // If there was an error sending, attempt to reconnect
      if (!isConnected) {
        initWebSocket();
      }
    }
  }

  function formatTime(timestamp: string | undefined) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
</script>

<div class="flex flex-col h-screen">
  <div class="px-4 py-3 bg-primary text-primary-content">
    <h2 class="text-xl font-bold">Chat: {topic} (Group {group})</h2>
  </div>

  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar: Display online users in the chat room -->
    <aside class="w-64 bg-base-200 p-4">
      <h3 class="text-xl font-bold mb-4">Online Users</h3>
      {#if users.length > 0}
        <ul class="menu">
          {#each users as user (user.id)}
            <li class="p-2 rounded hover:bg-base-300">{user.name}</li>
          {/each}
        </ul>
      {:else}
        <p class="text-sm text-gray-500">No users online</p>
      {/if}

      <div class="mt-4">
        <div class="text-sm {isConnected ? 'text-success' : 'text-error'}">
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
    </aside>

    <!-- Main Chat Area -->
    <main class="flex flex-col flex-1 p-4">
      <div id="chatArea" class="flex flex-col flex-1 overflow-y-auto space-y-2">
        {#each messages as message (message.id)}
          <div
            class="chat {message.user === currentUser?.username
              ? 'chat-end'
              : 'chat-start'}"
          >
            <div class="chat-header">
              {message.user}
              {#if message.timestamp}
                <time class="text-xs opacity-50"
                  >{formatTime(message.timestamp)}</time
                >
              {/if}
            </div>
            <div class="chat-bubble">
              {message.text}
            </div>
          </div>
        {/each}
      </div>

      <!-- Message input and send button -->
      <div class="mt-4 flex">
        <input
          type="text"
          bind:value={newMessage}
          placeholder="Type a message..."
          class="input input-bordered flex-1"
          on:keypress={(e) => e.key === "Enter" && sendMessage()}
          disabled={!isConnected}
        />
        <button
          class="btn btn-primary ml-2"
          on:click={sendMessage}
          disabled={!isConnected}
        >
          Send
        </button>
      </div>
    </main>
  </div>
</div>
