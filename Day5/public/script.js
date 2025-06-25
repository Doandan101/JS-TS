document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-contact');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const contactsList = document.getElementById('contacts');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    let editingEmail = null;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        if (editingEmail) {
            // Sửa
            await fetch(`/contacts/${editingEmail}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone })
            });
            editingEmail = null;
        } else {
            // Thêm
            await fetch('/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            });
        }
        loadContacts();
        this.reset();
    });

    searchButton.addEventListener('click', async function () {
        const query = searchInput.value;
        const res = await fetch(`/contacts/search?query=${encodeURIComponent(query)}`);
        if (res.ok) {
            const results = await res.json();
            contactsList.innerHTML = '';
            results.forEach(contact => {
                const li = document.createElement('li');
                li.textContent = `${contact.name} - ${contact.email} - ${contact.phone}`;
                contactsList.appendChild(li);
            });
        } else {
            alert('Search failed');
        }
    });

    async function loadContacts() {
        const res = await fetch('/contacts/search?query=');
        const contacts = await res.json();
        const ul = document.getElementById('contacts');
        ul.innerHTML = '';
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.textContent = `${contact.name} (${contact.email}) - ${contact.phone}`;
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Xóa';
            delBtn.onclick = async () => {
                await fetch(`/contacts/${encodeURIComponent(contact.email)}`, { method: 'DELETE' });
                loadContacts();
            };
            li.appendChild(delBtn);

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Sửa';
            editBtn.onclick = () => {
                document.getElementById('name').value = contact.name;
                document.getElementById('email').value = contact.email;
                document.getElementById('phone').value = contact.phone;
                editingEmail = contact.email;
            };
            li.appendChild(editBtn);

            ul.appendChild(li);
        });
    }
    window.onload = loadContacts;
});