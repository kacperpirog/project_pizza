const registerFormEmail = document.querySelector('.register__form__email__input');
const registerFormPassword = document.querySelector('.register__form__password__input');
const registerFormBtn = document.querySelector('.register__form__btn');
const registerUserList = document.querySelector('.register__user__list');
let users = [];
class RegisterForm {
  constructor() {
    this.createUser();
  }
  createUser() {
    const userWrapper = document.createElement('li');
    userWrapper.classList.add('user__wrapper');

    const emailWrapper = document.createElement('p');
    emailWrapper.classList.add('email__wrapper');
    emailWrapper.innerHTML = registerFormEmail.value;

    const passwordWrapper = document.createElement('p');
    passwordWrapper.classList.add('password__wrapper');
    passwordWrapper.innerHTML = registerFormPassword.value;

    const deleteUserBtn = document.createElement('button');
    deleteUserBtn.classList.add('delete__user');
    deleteUserBtn.innerHTML = 'delete';

    const editUserEmailBtn = document.createElement('button');
    editUserEmailBtn.classList.add('edit__user');
    editUserEmailBtn.innerHTML = 'edit email';

    const editUserPasswordBtn = document.createElement('button');
    editUserPasswordBtn.classList.add('edit__user');
    editUserPasswordBtn.innerHTML = 'edit password';

    userWrapper.appendChild(emailWrapper);
    userWrapper.appendChild(passwordWrapper);
    userWrapper.appendChild(deleteUserBtn);
    userWrapper.appendChild(editUserEmailBtn);
    userWrapper.appendChild(editUserPasswordBtn);

    registerUserList.appendChild(userWrapper);
       
    deleteUserBtn.addEventListener('click', () => this.deleteUser(userWrapper, emailWrapper));
    editUserEmailBtn.addEventListener('click', () => this.editUserEmail(emailWrapper, userWrapper));
  }
  editUserEmail(emailWrapper, userWrapper) {
    const editUserInputEmail = document.createElement('input');
    const saveEditBtn = document.createElement('button');
    saveEditBtn.innerHTML = 'save edit';
    const formEditUserEmail = document.createElement('form');

    formEditUserEmail.appendChild(editUserInputEmail);
    formEditUserEmail.appendChild(saveEditBtn);
    // userWrapper.removeChild(emailWrapper)
    userWrapper.prepend(formEditUserEmail);
    console.log(emailWrapper);

    saveEditBtn.addEventListener('click', (e) => this.saveEditEmail(editUserInputEmail.value, userWrapper,emailWrapper, formEditUserEmail, e) );

   

  }

  saveEditEmail(newEmail, userWrapper, emailWrapper,formEditUserEmail, e) {
    e.preventDefault();
    // const newEmailWrapper = document.createElement("p")
    // newEmailWrapper.classList.add('email__wrapper');
    // newEmailWrapper.innerHTML = newEmail

    userWrapper.removeChild(formEditUserEmail);
    emailWrapper.innerHTML = newEmail;


  }

  deleteUser(userWrapper, userEmail ) {

    registerUserList.removeChild(userWrapper);
    // const indexRegister = users.indexOf();
    // users.splice(indexRegister, 1);

    users = users.filter((el) => el.email !== userEmail.innerHTML);


    console.log(users);
  }
}

const addUserToUserList = (event) => {
  event.preventDefault();
  new RegisterForm();

  const newUser = {
    email: registerFormEmail.value,
    password: registerFormPassword.value
  };
  users.push(newUser);
  console.log(users);
  registerFormEmail.value = '';
  registerFormPassword.value ='';
};


registerFormBtn.addEventListener('click', addUserToUserList);


