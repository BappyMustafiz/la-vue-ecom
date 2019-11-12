<template>
    <div class="container">
        <div class="row mt-5">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3>

                <div class="card-tools">
                    <button class="btn btn-primary" @click="newModal"><i class="fas fa-user-plus"></i> Add New</button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.type | capitalize }}</td>
                      <td>{{ user.created_at | formatDate }}</td>
                      <td>
                          <a href="#" class="btn btn-success" @click="editModal(user)"><i class="fas fa-edit"></i></a>
                          <a href="#" class="btn btn-danger" @click="deleteUser(user.id)"><i class="fas fa-trash"></i></a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="addNewUser" tabindex="-1" role="dialog" aria-labelledby="addNewUserLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addNewUserLabel" v-show="!editMode">Add New User</h5>
                        <h5 class="modal-title" id="addNewUserLabel" v-show="editMode">Edit User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editMode ? updateUser() : createUser()">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input v-model="form.name" type="text" id="name" name="name" class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input v-model="form.email" type="email" id="email" name="email" class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input v-model="form.password" type="password" id="password" name="password" class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>
                            <div class="form-group">
                                <label for="type">User type</label>
                                <select name="type" id="type" v-model="form.type" class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Bio (Short description)</label>
                                <textarea v-model="form.bio"  name="bio" class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" v-show="!editMode">Create</button>
                            <button type="submit" class="btn btn-success" v-show="editMode">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
   import Form from 'vform'
   export default {
      data(){
         return {
            form: new Form({
              id: '',
              name: '',
              email: '',
              password: '',
              type: '',
              bio: '',
              photo: ''
            }),
            users: [],
            editMode: false
         }
      },
      methods: {
         newModal(){
            this.editMode = false
            this.form.reset();
            this.form.clear();
            $('#addNewUser').modal('show')
         },
         editModal(user){
            this.editMode = true
            this.form.reset();
            this.form.clear();
            $('#addNewUser').modal('show')
            this.form.fill(user)
         },
         createUser(){
            this.$Progress.start()
            this.form.post('api/user')
            .then(()=>{
               Fire.$emit('RefreshPage');
               $('#addNewUser').modal('hide');
               toast.fire({
                 icon: 'success',
                 title: 'User created successfully'
               })
               this.$Progress.finish()
            })
           .catch(()=>{
               this.$Progress.fail()  
           })
         },
         loadUsers(){
            axios.get('api/user').then(({data}) => (this.users = data.data))
         },
         updateUser(){
            this.$Progress.start()
            this.form.put('api/user/'+this.form.id)
            .then(()=>{
               Fire.$emit('RefreshPage');
               $('#addNewUser').modal('hide');
               swal.fire(
                  'Updated!',
                  'User Information updated.',
                  'success'
               )
               this.$Progress.finish()
            })
            .catch(()=>{
               this.$Progress.fail()    
            })
         },
         deleteUser(id){
            swal.fire({
               title: 'Are you sure?',
               text: "You won't be able to revert this!",
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
               if(result.value){
                  this.form.delete('/api/user/'+id)
                     .then(()=>{
                     swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                     )
                     Fire.$emit('RefreshPage');
                   })
                   .catch(()=>{
                     swal.fire(
                       'Oops!',
                       'Something went wrong.',
                       'warning'
                     )
                 })
               }
            })
         }
      },
     created(){
       this.loadUsers();
       Fire.$on('RefreshPage',() => {
         this.loadUsers();
       })
     }
   }
</script>
