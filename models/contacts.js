import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('models', 'contacts.json');
console.log(contactsPath);

function updateContact(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

export const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

export const getContactById = async (id) => {
  const contacts = await listContacts();
  const oneContact = contacts.find((item) => item.id === id);
  return oneContact || null;
};

export const removeContact = async (id) => {
  const contacts = await listContacts();

  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [newContactsArray] = contacts.splice(index, 1);
  // деструктуризуємо масив контакітв, видаляємо потрібний
  await updateContact(contacts);
  //  оновлюємо наш масив контактів після видалення;
  return newContactsArray;
  // метод сплайс дозволяє повернути масив з видаленим контактом.
};

export const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContact(contacts);

  return newContact;
};

export const updateContactById = async (id, { name, email, phone }) => {
  const contacts = await listContacts();

  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id, name, email, phone };
  await updateContact(contacts);

  return contacts[index];
};
