
// import { removeCustomer } from './src/utils';

const customerList = document.getElementById('customer-items');
const newCustomerForm = document.getElementById('new-customer-form');
const newCustomerAction = document.getElementById('new-customer-action');
const newCustomerContainer = document.getElementById('new-customer-container');
const newCustomerFormClose = document.getElementById('new-customer-form-close');

// Tenker at url burde være i en config.js som importeres og gjenbrukes
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/

const customerPromise = fetch('http://172.20.21.90:8080/api/contacts', { method: 'GET', timeout: 2000 });

const refreshCustomers = function refreshCustomers() {
  return new Promise((resolve, reject) => {
    const customerMarkup = customerPromise
      .then(responses => responses.json())
      .then((customers) => {
        customerList.innerHTML = customers.map(customer => `
          <li data-id="${customer._id}">
            <label><input class="toggle" type="checkbox"></input>${customer.name}</label>
            <span>${customer.name}</span>
            <span>${customer.orgno}</span>
            <span>${customer.leader_name}</span>
            <span>${customer.leader_title}</span>
            <span>${customer.type}</span>
            <button class="destroy"></button>
          </li>`).join('');
      })
      .catch((err) => {
        // handle error response
        console.error(err);
        customerList.innerHTML = '<li>Ingen kunder ble funnet. Noe må være galt!</li>';
      });
    if (customerMarkup) {
      resolve(customerMarkup);
    } else {
      customerList.innerHTML = '<li>Noe gikk galt</li>';
      reject(Error('Dont work'));
    }
  });
};

const updateList = function updateList() {
  refreshCustomers()
    .then(() => {
      const deleteElements = [...document.querySelectorAll('.destroy')];
      deleteElements.map(element =>
        element.addEventListener('click', () => {
          const id = element.parentElement.getAttribute('data-id');
          const customerDeletePromise = fetch(`http://172.20.21.90:8080/api/contacts/${id}`, {
            method: 'DELETE',
          });
          customerDeletePromise
          .then(responses => responses.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            // Update customer list on the fly
          })
          .catch((err) => {
              // handle error response
              console.error(err);
          });
        }),
      );
    },
  );
};
/* eslint-enable*/
/* global customer_name:true*/
/* global orgno:true*/
/* global leader_title:true*/
/* global leader_title:true*/
/* global type:true*/

newCustomerForm.onsubmit = function submitCustomerForm() {
  const testNineDigits = document.getElementById('customer_name').validity.patternMismatch;
  console.log(testNineDigits);
  // get the input from the form in a smarter way
  const newCustomer = {
    name: customer_name.value,
    orgno: parseInt(orgno.value, 10),
    leader_title: leader_title.value,
    leader_name: leader_title.value,
    type: type.value,
  };

// move this out to separate js module/file with newCustomer as param
  const postPromise = fetch('http://172.20.21.90:8080/api/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCustomer),
  });

  postPromise
    .then(responses => responses.json())
    .then((result) => {
      console.log(JSON.stringify(result));
      // Update the list and give the user a confirmation message
    })
    .catch((err) => {
      console.error(err);
      // handle errors
    });
  // Don't send the form
  return false;
};

const toggleForm = function toggleForm(element) {
  element.classList.toggle('visible');
};

// add eventlistener to the plus icon
newCustomerAction.addEventListener('click', () => toggleForm(newCustomerContainer));
newCustomerFormClose.addEventListener('click', () => toggleForm(newCustomerContainer));

updateList();
