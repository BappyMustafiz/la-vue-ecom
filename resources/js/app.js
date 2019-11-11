
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * vue router configuration
 */
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import moment from 'moment'
import VueProgressBar from 'vue-progressbar'
import swal from 'sweetalert2'
window.swal = swal

const toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
})
window.toast = toast


import { Form, HasError, AlertError } from 'vform'

window.form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

//  2. Define some routes
let routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue').default },
    { path: '/users', component: require('./components/Users.vue').default },
    { path: '/profile', component: require('./components/Profile.vue').default }
]

//Create the router instance and pass the `routes` option
const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})


//filter and moment js
Vue.filter('capitalize', function (value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}) 

Vue.filter('formatDate', function (date) {
  return moment(date).format('MMM Do YY');
}) 

//vue progressbar
const options = {
  color: '#1eb885',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

//custom event
let Fire = new Vue();
window.Fire = Fire;

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
//Create and mount the root instance.
const app = new Vue({
    el: '#app',
    router
});
