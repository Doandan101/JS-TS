import { marked } from 'marked';
import DOMPurify from 'dompurify';
import debounce from './utils/debounce.js';
import { throttle } from './utils/throttle.js';
import { diffDOM } from './utils/diffDOM.js';

const userSettings = {
  theme: 'light',
  fontSize: 16,
  tabSize: 2,
};

const config = new Proxy(userSettings, {
  get(target, prop, receiver) {
    logAction(`Accessed: ${prop}`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value) {
    logAction(`Updated: ${prop} = ${value}`);
    updateEditorStyles();
    return Reflect.set(target, prop, value);
  },
});

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const logs = document.getElementById('logs');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const themeSelect = document.getElementById('themeSelect');
const fontSizeInput = document.getElementById('fontSizeInput');

let autoSaveInterval = null;

function logAction(message) {
  const logEntry = document.createElement('div');
  logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logs.appendChild(logEntry);
  logs.scrollTop = logs.scrollHeight;
}

function updateEditorStyles() {
  editor.style.fontSize = `${config.fontSize}px`;
  preview.style.fontSize = `${config.fontSize}px`;

  // Đổi class cho body
  document.body.classList.remove('bg-gray-100', 'bg-gray-800', 'text-black', 'text-white');
  if (config.theme === 'light') {
    document.body.classList.add('bg-gray-100', 'text-black');
  } else {
    document.body.classList.add('bg-gray-800', 'text-white');
  }

  // Đổi class cho phần tử chứa editor (nếu muốn)
  const container = document.querySelector('.max-w-7xl');
  if (container) {
    container.classList.remove('bg-gray-100', 'bg-gray-800', 'text-black', 'text-white');
    if (config.theme === 'light') {
      container.classList.add('bg-gray-100', 'text-black');
    } else {
      container.classList.add('bg-gray-800', 'text-white');
    }
  }
}

const renderPreview = debounce(() => {
  const markdown = editor.value;
  const prevTree = createDOMTree(preview);
  const html = DOMPurify.sanitize(marked.parse(markdown));
  preview.textContent = ''; // Sử dụng textContent để tránh XSS
  preview.insertAdjacentHTML('beforeend', html);
  const nextTree = createDOMTree(preview);
  console.log('DOM Diff:', diffDOM(prevTree, nextTree));
  addHeadingIds();
}, 300);

function createDOMTree(element) {
  const tree = { tag: element.tagName.toLowerCase(), children: [] };
  for (const child of element.childNodes) {
    if (child.nodeType === 1) {
      tree.children.push(createDOMTree(child));
    } else if (child.nodeType === 3 && child.textContent.trim()) {
      tree.children.push(child.textContent.trim());
    }
  }
  return tree;
}

function addHeadingIds() {
  const headings = preview.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    heading.id = `heading-${index + 1}`;
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'SCRIPT' || node.innerHTML?.includes('<script')) {
          node.remove();
          logAction('Blocked potential XSS script');
        }
      });
    }
  });
});

observer.observe(preview, { childList: true, subtree: true });

function startEditor() {
  autoSaveInterval = setInterval(() => {
    localStorage.setItem('markdown', editor.value);
    logAction('Auto-saved content');
  }, 3000);
  editor.disabled = false;
  logAction('Editor started');
}

function stopEditor() {
  clearInterval(autoSaveInterval);
  editor.disabled = true;
  logAction('Editor stopped');
}

editor.addEventListener('input', renderPreview);
themeSelect.addEventListener('change', () => {
  config.theme = themeSelect.value; // sẽ gọi set và updateEditorStyles()
});
fontSizeInput.addEventListener('input', () => {
  let value = parseInt(fontSizeInput.value);
  if (isNaN(value) || value <= 0) value = 1; // chỉ không cho số âm hoặc 0
  fontSizeInput.value = value;
  config.fontSize = value; // sẽ gọi set và updateEditorStyles()
});
startBtn.addEventListener('click', startEditor);
stopBtn.addEventListener('click', stopEditor);

window.addEventListener('resize', throttle(() => {
  logAction('Window resized');
}, 100));

requestIdleCallback(() => {
  const analyzeMarkdown = () => {
    const text = editor.value;
    const headings = (text.match(/^#{1,6}\s/gm) || []).length;
    const lists = (text.match(/[-*+]\s/gm) || []).length;
    const words = text.split(/\s+/).length;
    logAction(`Analysis: ${headings} headings, ${lists} lists, ${words} words`);
  };
  analyzeMarkdown();
});

// Mock API fetch với CORS
// fetch('https://api.other.com/data', { mode: 'cors' })
//   .then((res) => res.json())
//   .catch((err) => logAction(`Fetch error: ${err.message}`));

// Khởi tạo
updateEditorStyles();
editor.value = localStorage.getItem('markdown') || '# Welcome to Markdown Editor\nWrite here...';
renderPreview();

export function startMarkdownEditor() {
  startEditor();
}

export function stopMarkdownEditor() {
  stopEditor();
}

export default {
  startMarkdownEditor,
  stopMarkdownEditor,
};