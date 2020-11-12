const registerFormEmail = document.querySelector('.register__form__email__input');
const registerFormPassword = document.querySelector('.register__form__password__input');
const registerFormBtn = document.querySelector('.register__form__btn');
const registerUserList = document.querySelector('.register__user__list');
// const user = [];
class RegisterForm {
  constructor() {
    this.createUser();
  }
  createUser() {
    const userWrapper = document.createElement('li');
    userWrapper.classList.add('user__wrapper');
    const emailwrapper = document.createElement('p');
    emailwrapper.classList.add('email__wrapper');
    emailwrapper.innerHTML = registerFormEmail.value;
    const passwordWrapper = document.createElement('p');
    passwordWrapper.classList.add('password__wrapper');
    passwordWrapper.innerHTML = registerFormPassword.value;
    const deleteUserBtn = document.createElement('button');
    deleteUserBtn.classList.add('delete__user');
    deleteUserBtn.innerHTML = 'delete';

    userWrapper.appendChild(emailwrapper);
    userWrapper.appendChild(passwordWrapper);
    userWrapper.appendChild(deleteUserBtn);

    registerUserList.appendChild(userWrapper);
       
  }
}  

const addUserToUserList = (e) => {
  e.preventDefault();
  new RegisterForm();
  registerFormEmail.value = '';
  registerFormPassword.value ='';
};

registerFormBtn.addEventListener('click', addUserToUserList);




export default RegisterForm;
