"use strict";

const messageSystem = {
  startFetching() {
    document.getElementById('messageForm').addEventListener('submit');
    setInterval(this.fetchMessages, 1000);
  },

  sendMessage(msg) {
    // https://thecrew.cc/api/message/create.php?token=__TOKEN__ POST
    fetch('https://thecrew.cc/api/message/create.php?token=' + userSystem.token, {
        method: 'POST',
        body: JSON.stringify({
          message: msg
        })
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.fetchMessages();
      });
  },

  fetchMessages() {
    // https://thecrew.cc/api/message/read.php?token=__TOKEN__ GET
    fetch('https://thecrew.cc/api/message/read.php?token=' + userSystem.token, {
        method: 'GET'
      })
      .then(response => response.json())
      /* if (status == 201) {
                  console.error(data);
                } else if (status == 200) {}*/
      .then((data) => {
        //data.sort((a, b) => b.ID - a.ID);
        console.log(data);
        const outputField = document.getElementById('output');
        outputField.innerHTML = "";

        if (data.length == 0) {
          outputField.innerHTML = "No messages";
        } else {
          data.forEach(item => {
            const outputMessage = //eventuuel toevoegen id="message-${item.ID}"
              `<div class="message">
            <span class="by">${item.handle}</span>
            <span class="on">${item.created_at}</span
            ><p>${item.message}</p>
            </div>`;
            outputField.insertAdjacentHTML("afterbegin", outputMessage);
          });
        }
      });
  }
};

const userSystem = {
  token: "",
  loggedIn: false,

  checkToken() {
    const localToken = this.getToken();
    if (localToken !== null) {
      this.token = localToken;
      messageSystem.fetchMessages();
      document.getElementById('loginWindow').style.display = 'none';
    }
  },
  saveToken() {
    localStorage.setItem("token", this.token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  logout() {
    localStorage.removeItem("token");
    location.reload();
  },

  login(email, password) {
    // https://thecrew.cc/api/user/login.php POST
    fetch('https://thecrew.cc/api/user/login.php', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          pasword: password
        })
        //kan ook: body: JSON.stringify{email, password}
      })
      .then(response => response.json())
      .then((data) => {
        const token = data.token;
        this.token = token;
        this.saveToken();
        messageSystem.fetchMessages();

        document.getElementById('loginWindow').style.display = 'none';
      });
  },

  updateUser(password, handle) {
    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
    fetch(`https://thecrew.cc/api/user/update.php?token=` + userSystem.token, {
        method: 'POST',
        body: JSON.stringify({
          handle,
          password
        })
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
      });
  }
};

const display = {
  initFields() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('emailField').value;
      const password = document.getElementById('passwordField').value;
      userSystem.login(email, password);
    });
    document.getElementById('logoutBtn').addEventListener('click', userSystem.logout);
    document.getElementById('messageForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const messageField = document.getElementById('messageField');
      messageSystem.sendMessage(messageField.value);
      messageField.value = "";
    });
  }
};

display.initFields();
userSystem.checkToken();