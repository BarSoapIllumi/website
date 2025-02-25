let appContent = {
    "file-explorer": {
        title: "File Explorer",
        content: "<p>Here are my projects:</p><ul><li>Project 1</li><li>Project 2</li></ul>",
        //background: "images/file-explorer-bg.jpg",
        open: false
    },
    "instagram": {
        title: "Social Media",
        content: "<p>Connect with me:</p><img  href='https://linkedin.com' target='_blank'>LinkedIn</a><br><a href='https://github.com' target='_blank'>GitHub</a>",
        background: "images/InstagramIcon.png",
        open: false
    }
};

function openApp(appId) {
    console.log(appId);
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
                    <button onclick="closeApp('${appId}')">X</button>
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
    } else {
        existingWindow.style.display = 'block';
    }

    taskbarIcon.classList.add('active');
}

function closeApp(appId) {
    document.getElementById(appId).style.display = 'none';
    document.getElementById('taskbar-' + appId).classList.remove('active');
    appContent[appId].open = false;
}

function minimizeApp(appId) {
    document.getElementById(appId).style.display = 'none';
    document.getElementById(appId).style.display = 'none';
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

// Highlight taskbar icons on hover
// document.querySelectorAll('.taskbar-icon').forEach(icon => {
//     icon.addEventListener('mouseover', () => icon.style.opacity = '0.8');
//     icon.addEventListener('mouseout', () => {
//         if (!icon.classList.contains('active')) {
//             icon.style.opacity = '0.5';
//         }
//     });
// });