let appContent = {
    "file-explorer": {
        title: "File Explorer",
        content: "<p>Here are my projects:</p><ul><li>Project 1</li><li>Project 2</li></ul>",
        background: "images/file-explorer-bg.jpg",
        open: false
    },
    "instagram": {
        title: "Socials",
        content: "<p>Connect with me:</p><img  href='https://linkedin.com' target='_blank'>LinkedIn</a><br><a href='https://github.com' target='_blank'>GitHub</a>",
        background: "images/InstagramIcon.png",
        open: false
    }
};


function openApp(appId) {
    let windowsContainer = document.getElementById('windows-container');
    let existingWindow = document.getElementById(appId);
    let taskbarIcon = document.getElementById('taskbar-' + appId);


    if (!existingWindow) {
        let newWindow = document.createElement('div');
        newWindow.classList.add('window');
        newWindow.id = appId;
        newWindow.innerHTML = `
            <div class="window-header">
                <span>${appContent[appId]?.title}</span>
                <div>
                    <button onclick="minimizeApp('${appId}')">-</button>
                    <button onclick="maximizeApp('${appId}')">□</button>
                    <button onclick="closeApp('${appId}')">x</button>
                </div>
            </div>
            <div class="window-body" style="padding: 10px; background: url('appContent[appId].background') no-repeat center center; background-size: cover;">
                ${appContent[appId]?.content}
            </div>
        `;
        newWindow.style.top = '100px';
        newWindow.style.left = '100px';
        newWindow.style.display = 'block';
        windowsContainer.appendChild(newWindow);
        makeDraggable(newWindow);
        activateApp(newWindow);
        appContent[appId].open = true;
    } else {
        if (appContent[appId].open) {
            console.log('Already open');
            minimizeApp(appId);
            taskbarIcon.classList.add('open');
            return;
        }
        existingWindow.style.display = 'block';
        activateApp(existingWindow);
        appContent[appId].open = true;
    }
    taskbarIcon.classList.add('active');
}

function closeApp(appId) {
    let window = document.getElementById(appId);
    window.style.display = 'none';
    document.getElementById('taskbar-' + appId).classList.remove('open');
    document.getElementById('taskbar-' + appId).classList.remove('active');
    appContent[appId].open = false;
}

function minimizeApp(appId) {
    document.getElementById(appId).style.display = 'none';
    document.getElementById('taskbar-' + appId).classList.remove('active');
    document.getElementById('taskbar-' + appId).classList.add('open');
    appContent[appId].open = false;
}

function maximizeApp(appId) {
    let appWindow = document.getElementById(appId);
    if (appWindow.style.width === '100vw' && appWindow.style.height === '100vh') {
        appWindow.style.width = '400px';
        appWindow.style.height = '300px';
    } else {
        appWindow.style.width = '100vw';
        appWindow.style.height = '100vh';
        appWindow.style.top = '0';
        appWindow.style.left = '0';
    }
}

// Function to enable dragging
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    const header = element.querySelector('.window-header');
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.zIndex = 1000; // Bring to front
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Close the website (simulate shutdown)
function closeWebsite() {
    window.close();
}


function activateApp(window) {
    
    let allWindows = document.querySelectorAll(".window");
    if (window) {
        // Bring clicked window to the front
        zCount++; // Increase z-index counter
        window.style.zIndex = zCount; // Set new z-index

        // Make the clicked window active
        for(let win of allWindows) {
            win.classList.remove("active");
            document.getElementById('taskbar-' + win.id).classList.remove('active');
            document.getElementById('taskbar-' +  win.id).classList.add('open');
            appContent[win.id].open = false;
        }
        window.classList.add("active");
        document.getElementById('taskbar-' + window.id).classList.remove('active');
    } else {
        // If clicked outside any window, remove active state from all windows
        for(let win of allWindows) {
            win.classList.remove("active");
        }
    }
}

let zCount = 10;
document.addEventListener("click", (event) => {
    let clickedWindow = event.target.closest(".window");
    activateApp(clickedWindow);
});


document.querySelectorAll(".icon").forEach(window => {
    window.addEventListener("dblclick", () => {
        console.log("Double click");
        let appId = window.getAttribute("data-app"); // Get appId from data attribute
        openApp(appId);
    });
});