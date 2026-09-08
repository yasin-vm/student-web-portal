const profileForm = document.querySelector('#profile-form');
const formMessage = document.querySelector('#form-message');
const photo = document.querySelector('#profile-photo');

photo?.addEventListener('error', () => {
  photo.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 480%22%3E%3Crect width=%22400%22 height=%22480%22 fill=%22%23dbe9e5%22/%3E%3Ctext x=%22200%22 y=%22245%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2270%22 fill=%22%231f6f5b%22%3EYV%3C/text%3E%3C/svg%3E';
  photo.alt = 'Placeholder for Yasin V M profile photo';
});

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = profileForm.elements.name.value.trim();
  const bloodGroup = profileForm.elements.bloodGroup.value;
  const genderSelected = profileForm.querySelector('input[name="gender"]:checked');

  if (!name || !bloodGroup || !genderSelected) {
    formMessage.textContent = 'Please enter your name and select your gender and blood group.';
    formMessage.classList.add('error');
    return;
  }

  formMessage.textContent = `Profile checked for ${name}. Your blood group is ${bloodGroup}.`;
  formMessage.classList.remove('error');
});

profileForm?.addEventListener('reset', () => {
  window.setTimeout(() => {
    formMessage.textContent = 'Optional fields cleared. Yasin, roll 52, S7 and B+ remain set.';
    formMessage.classList.remove('error');
  }, 0);
});
