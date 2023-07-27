// import '@./style/dashboard.css';
Vue.prototype.$id=0
Vue.prototype.$logid=0


// =====================================================================================================================
                                                // login
// =====================================================================================================================
const Login=Vue.component('login',{
    data: function(){
    return{
        username:"",
        password:"",
        error:""
    }
},
    template:` 
    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" aria-current="page" to="/signUp">Sign Up</router-link>
              </li>
            </ul>
            </div>
        </div>
    </nav>
    <h4 style="text-align: center;">Login</h4> 
    <div id="msg" v-if="error">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>{{error}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
  </div>
    <div class="container-fluid">
            <div class="col">
                <label class="col-1 form-label">Username</label>
                <input class="col-3" type="text" name="username" id="username" required v-model="username">
            </div>
            <div class="col">
                <label class="col-1 form-label">Password</label>
                <input class="col-3" type="password" name="password" id="password" minlength="4" required v-model="password">
            </div>
            <button type="submit" class="btn btn-primary" @click=check_details()>Login</button>
        </div>
        <div class="container-fluid"><p>New User? <router-link to="/signUp">Sign Up</router-link></p></div>
    </div>`,
    methods:{
        check_details: async function(){
            if(this.username.indexOf("'")>-1 || this.password.indexOf("'")>-1){
                this.error="Email or password should not have ' or \" "
            }
            else{
                try{
                    url="http://127.0.0.1:5000/api/login/"+this.username+"/"+this.password
                    r=await fetch(url);
                    data= await r.json()
                    if (!r.ok) {
                    this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                    throw new Error(this.error);
                    }
                    // this.$router.push({name: "/dash"})
                    this.$router.push('/dash')
                }
                catch(err){
                    this.error=err
                }
            }
        }
    }
})


// =====================================================================================================================
                                                // Sign up
// =====================================================================================================================
const signup=Vue.component('signup',{
    data: function(){
        return{
            username:"",
            password:"",
            re_password:"",
            email:"",
            webhook:"",
            report_option:"",
            error:"",
            msg:""
        }
    },
    template:`
    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" aria-current="page" to="/">Login</router-link>
              </li>
            </ul>
            </div>
        </div>
    </nav>
    <h4 style="text-align: center;">SignUp</h4>
    <div id="msg" v-if="error">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>{{error}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
  </div>
  <div class="msg" v-if="msg">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>{{msg}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <div class="container-fluid">
            <div class="col">
                <label class="col-2 form-label">Username</label>
                <input class="col-3" type="text" name="username" id="username" required v-model="username">
            </div>
            <div class="col">
                <label class="col-2 form-label">Email ID</label>
                <input class="col-3" type="text" name="email" id="email" required v-model="email">
            </div>
            <div class="col">
                <label class="col-2 form-label">Webhook URL</label>
                <input class="col-3" type="text" name="webhook" id="webhook" required v-model="webhook">
            </div>
            <div class="col">
                <label class="col-2 form-label">Montly Report Format</label>
                <select class="col-3" name="format" id="format" ref="format" required>
                    <option value="HTML">HTML</option>
                    <option value="PDF">PDF</option>
                </select>
            </div>
            <div class="col">
                <label class="col-2 form-label">Password</label>
                <input class="col-3" type="password" name="password" id="password" required v-model="password">
            </div>
            <div class="col">
                <label class="col-2 form-label">Confirm Password</label>
                <input class="col-3" type="password" name="re_password" id="re_password" required v-model="re_password">
            </div>
            <button type="submit" class="btn btn-primary" @click=check_data()>Sign Up</button>
        </div>
    </div>`,
    methods:{
        check_data: async function(){
            if(this.username.indexOf("'")>-1 || this.password.indexOf("'")>-1 || this.re_password.indexOf("'")>-1 || this.email.indexOf("'")>-1 || this.webhook.indexOf("'")>-1){
                console.log("error"),
                this.error="ERROR cannot use ' or \" in username or password or email or webhook"
            }
            else if(this.password !== this.re_password){
                this.error="ERROR password and confirm password should be same"
                console.log(this.error)
            }
            else{
                this.report_option=this.$refs.format.value
                console.log(this.report_option)
                postData={
                    username:this.username,
                    password:this.password,
                    email: this.email,
                    webhook: this.webhook,
                    report_option: this.report_option
                }
                try{
                    url="http://127.0.0.1:5000/api/signup"
                    const res= await fetch(url,{
                        method:"post",
                    headers: {
                        "Content-Type": "application/json",},
                        body: JSON.stringify(postData),
                    })
                    if (!res.ok) {
                        data=await res.json()
                        if(data.uid==0){
                            this.error="Username already exist. Please Enter unique username"
                        }
                        else{
                      this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  }
                      throw new Error(this.error);
                    }
                    else{
                        this.msg="SignUp Successfully";
                    }
                }
                catch(err){
                    this.error=err.message
                } 
            }
            
        }
    }
})
// -----------------------------------------------------------------------------------------------------------------------------
                                                // Logs
// -----------------------------------------------------------------------------------------------------------------------------
const logs=Vue.component('logging',{
    data: function(){
        return{
            logs: [],
            id:"",
            show:false
        }
    },
    template:`

    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid ">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" to="/dash">Dashboard</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link active" to="/addLog">Add Log</router-link>
              </li>
              
              <li class="nav-item">
                <a href="#" class="nav-link active" aria-current="page" @click=logout()>Logout</a>
              </li>
            </ul>
            </div>
        </div>
    </nav>

<div id="msg" v-show="show">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Download will automatically complete in few seconds. Please continue with your work.</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
  </div>


        <h4 style="text-align: center;">Tracker ID: {{ this.$id }}</h4>
    <ul style="list-style-type: none; overflow: hidden;">
      <li style="float: left; padding-right: 10px;">
        <a :href="'/upload/'+id"><button class="btn btn-primary"> Import</button></a>
      </li>
      <li style="float: left; padding-right: 10px;">
        <a :href="'/export/log/'+id"><button class="btn btn-primary" id="export" @click=display_msg()> Export</button></a>
      </li>
      <li style="float: left; padding-right: 10px;">
        <a :href="'/trendline/'+id"><button type="submit" id="download" class="btn btn-primary"> Trendline</button></a>
      </li>

      <li style="float: left;">
        <router-link to="/stats"><button class="btn btn-primary" @click=send_id(id)> Stats</button></router-link>
      </li>
    </ul>

        <table>
        <tr>
          <th class="col-2" style="text-align: center;">Time Stamp</th>
          <th class="col-2">Value</th>
          <th class="col-2">Note</th>
          <th class="col-1">Edit</th>
          <th class="col-1">Delete</th>
        </tr>
        <tr v-for="log in logs">
          <td class="col-2">{{ log['timestamp'] }}</td>
          <td class="col-2">{{ log['value'] }}</td>
          <td class="col-2">{{ log['note'] }}</td>
          <td class="col-1"><router-link to="/editlog"><button class="btn btn-primary" @click=send_log_id(log.log_id)>Edit</button><router-link></td>
          <td class="col-1"><button class="btn btn-danger" @click=delete_log(log.log_id)>Delete</button></td>
        </tr>
      </table>
    </div>

    `,
    methods:{
        send_id: function(id){
            Vue.prototype.$id=id
            console.log(this.$id)
        },
         delete_log: async function(log_id) {
            // console.log(log_id)
            url="http://127.0.0.1:5000/api/log/"+log_id
            const r=await fetch(url,{method: "delete"})
            const result= await r.json()
            // console.log(result)
            url="http://127.0.0.1:5000/api/log/"+this.$id
            // console.log(url)
            res=await fetch(url)
            data= await res.json()
            this.logs=data

        },
        send_log_id:function(log_id){
            Vue.prototype.$logid=log_id
        },
        display_msg: function(){
            this.show=true

        },
        logout: async function(){
            try{
                url="http://127.0.0.1:5000/api/logout"
                res= await fetch(url)
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                this.$router.push("/")
            }
            catch(err){
                this.error(err)
                console.log(err)
            }
        }
    },
    mounted: async function(){

        url="http://127.0.0.1:5000/api/log/"+this.$id
        console.log(url)
        r=await fetch(url)
        data= await r.json()
        // console.log(data)
        this.logs=data
        this.id=this.$id
        // console.log(this.logs)
        // window.location.reload();
    }
})

// -----------------------------------------------------------------------------------------------------------------------------
                                                // Add Log
// -----------------------------------------------------------------------------------------------------------------------------
const addLog=Vue.component('addLog',{
    data: function(){
        return{
            error:"",
            msg:"",
            ttype:"",
            id:"",
            options:"",
            timestamp:""

        }
    },
    template:`

    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid ">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" to="/dash">Dashboard</router-link>
              </li>
              
              <li class="nav-item">
                <a href="#" class="nav-link active" aria-current="page" @click=logout()>Logout</a>
              </li>
            </ul>
            </div>
        </div>
    </nav>
    <div class="msg" v-if="error">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>{{error}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    <div class="msg" v-if="msg">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>{{msg}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
        <div class="container-fluid">
            <div class="col">
                <label class="col-2 form-label">Time Stamp</label>
                <input class="col-3" type="text" ref="timestamp" :value="timestamp" required />
            </div>
            <div class="col form-group">
                <label class="col-2 form-label">Tracker Number:</label>
                <span class="col-4 card-text"><b>Tracker {{id}}</b> </span>
            </div>
            <div class="col">
                <label class="col-2 form-label">Value</label>
                <input v-if="ttype==='Numerical'" class="col-4" ref="value" type="Number" step="0.01" name="value" id="value" minlength="4" required >
                <input v-if="ttype==='Time Duration'" class="col-4" ref="value" type="time" name="value" id="value">
                <select v-if="ttype==='Boolean'" class="col-4" ref="value" name="value">
                    <option value="True">True</option>
                    <option value="False">False</option>
                </select>

                <select v-if="ttype==='Multiple Choice'" class="col-4" ref="value" name="value">
                    <option v-for="choices in options" :value="choices['choice']">{{choices['choice']}}</option>
                </select>
            </div>
            <div class="col">
                <label class="col-2 form-label">Note</label>
                <input class="col-3" type="text" ref="note" required />
            </div>

            <button type="submit" class="btn btn-primary" @click=addLog()>Submit</button>
        </div>
    </div>`,
    methods:{
        getMonth: function () {
          return new Date().getMonth()+1;
        },
        getDate: function(){
            return new Date()
        },
        getYear: function(){
            return new Date().getFullYear();
        },
        getTime: function () {
      return new Date().toLocaleTimeString();
    },
        addLog: async function(){
            // console.log("hello")
            time=this.$refs.timestamp.value
            value=this.$refs.value.value
            note=this.$refs.note.value
            // console.log(value)
            if(time===""){
                this.error="Please Enter Time"
            }
            else if(value===""){
                this.error="Please Enter Value"
            }
            else if(note===""){
                this.error="Please Enter Note"
            }
            else{
            const postData={
                timestamp: time,
                value : value,
                note: note,
            }
            try{
                url="http://127.0.0.1:5000/api/log/"+this.$id
                const res= await fetch(url,{
                    method:"post",
                headers: {
                    "Content-Type": "application/json",},
                    body: JSON.stringify(postData),
                })
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                else{
                    this.msg="Added Successfully";
                }
            }
            catch(err){
                this.error=err.message
            }
        }
        },
        logout: async function(){
            try{
                url="http://127.0.0.1:5000/api/logout"
                res= await fetch(url)
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                this.$router.push("/")
            }
            catch(err){
                this.error(err)
                console.log(err)
            }
        }
    },
    mounted: async function(){
        url="http://127.0.0.1:5000/api/tracker"
        r=await fetch(url)
        data= await r.json()
        // console.log(data)
        for (var i = 0; i < data.length; i++) {
            if(data[i].id===this.$id){
                this.ttype=data[i].tracker_type
                this.id=this.$id
                break;
            }
        }
        if(this.ttype==="Multiple Choice"){
            url="http://127.0.0.1:5000/api/choices/"+this.$id
            res=await fetch(url)
            this.options=await res.json()
            // console.log(choice)
        }
        this.timestamp=this.getDate()
    }
})

// -----------------------------------------------------------------------------------------------------------------------------
                                                // Edit Log
// -----------------------------------------------------------------------------------------------------------------------------
const editLog=Vue.component('editLog',{
    data: function(){
        return{
            error:"",
            msg:"",
            ttype:"",
            id:"",
            options:"",
            timestamp:"",
            value:"",
            note:""

        }
    },
    template:`

    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid ">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" to="/dash">Dashboard</router-link>
              </li>
              
              <li class="nav-item">
                <a href="#" class="nav-link active" aria-current="page" @click=logout()>Logout</a>
              </li>
            </ul>
            </div>
        </div>
    </nav>
    <div class="msg" v-if="error">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>{{error}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    <div class="msg" v-if="msg">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>{{msg}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
        <div class="container-fluid">
            <div class="col">
                <label class="col-2 form-label">Time Stamp</label>
                <input class="col-3" type="text" ref="timestamp" :value="timestamp" required />
            </div>
            <div class="col form-group">
                <label class="col-2 form-label">Tracker Number:</label>
                <span class="col-4 card-text"><b>Tracker {{id}}</b> </span>
            </div>
            <div class="col">
                <label class="col-2 form-label">Value</label>
                <input v-if="ttype==='Numerical'" class="col-4" ref="value" type="Number" step="0.01" :value=value required >
                <input v-if="ttype==='Time Duration'" class="col-4" ref="value" type="time" :value=value required>
                <select v-if="ttype==='Boolean'" class="col-4" ref="value" :value=value>
                    <option value="True">True</option>
                    <option value="False">False</option>
                </select>

                <select v-if="ttype==='Multiple Choice'" class="col-4" ref="value" :value=value>
                    <option v-for="choices in options" :value="choices['choice']">{{choices['choice']}}</option>
                </select>
            </div>
            <div class="col">
                <label class="col-2 form-label" >Note</label>
                <input class="col-3" type="text" ref="note" :value=note required />
            </div>

            <button type="submit" class="btn btn-primary" @click=editLog()>Submit</button>
        </div>
    </div>`,
    methods:{
        getMonth: function () {
          return new Date().getMonth()+1;
        },
        getDate: function(){
            return new Date()
        },
        getYear: function(){
            return new Date().getFullYear();
        },
        getTime: function () {
      return new Date().toLocaleTimeString();
    },
        editLog: async function(){
            // console.log("hello")
            time=this.$refs.timestamp.value
            value=this.$refs.value.value
            note=this.$refs.note.value
            // console.log(value)
            if(time===""){
                this.error="Please Enter Time"
            }
            else if(value===""){
                this.error="Please Enter Value"
            }
            else if(note===""){
                this.error="Please Enter Note"
            }
            else{
            const putData={
                timestamp: time,
                value : value,
                note: note,
            }
            try{
                console.log(this.$logid)
                url="http://127.0.0.1:5000/api/log/"+this.$logid
                const res= await fetch(url,{
                    method:"put",
                headers: {
                    "Content-Type": "application/json",},
                    body: JSON.stringify(putData),
                })
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                else{
                    this.msg="Edit Successful";
                }
            }
            catch(err){
                this.postData=err.message
            }
        }
        },
        logout: async function(){
            try{
                url="http://127.0.0.1:5000/api/logout"
                res= await fetch(url)
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                this.$router.push("/")
            }
            catch(err){
                this.error(err)
                console.log(err)
            }
        }
    },
    mounted: async function(){
        url="http://127.0.0.1:5000/api/tracker"
        r=await fetch(url)
        data= await r.json()
        // console.log(data)
        this.id=this.$id
        for (var i = 0; i < data.length; i++) {
            if(data[i].id===this.$id){
                this.ttype=data[i].tracker_type
                break;
            }
        }
        if(this.ttype==="Multiple Choice"){
            url="http://127.0.0.1:5000/api/choices/"+this.$id
            res=await fetch(url)
            this.options=await res.json()
            // console.log(choice)
        }

        url="http://127.0.0.1:5000/api/log/"+this.id
        res=await fetch(url)
        data=await res.json()
        for (var i = 0; i < data.length; i++) {
            if(data[i].log_id===this.$logid){
                this.timestamp=data[i].timestamp
                this.value=data[i].value
                this.note=data[i].note
                break;
            }
        }
    }
})

// =====================================================================================================================
                                                // stats
// =====================================================================================================================
const stats=Vue.component('stats',{
    data:function(){
        return{
            tracker_name:"",
            tracker_type:"",
            max:0,
            min:1000000000000000,
            max_hr:0,
            max_min:0,
            min_hr:0,
            min_min:0,
            avg_hr:0,
            avg_min:0,
            maxkey:[],
            minkey:[],
            count:0,
            sum:0,
            avg:"",
            t_count:0,
            f_count:0,
            d:{},
            id:""
        }
    },
    template:`
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" to="/dash">Dashboard</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link active" to="/logging">View Log</router-link>
              </li>
              <!-- <li class="nav-item">
                <router-link class="nav-link active" href="/trendline/{{ tracker['id'] }}">Trendline</a>
              </li> -->
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#" @click=logout()>Logout</a>
              </li>
              
            </ul>
            </div>
        </div>
    </nav>

    <div>
        <h4 style="text-align: center;">{{tracker_name}} Statistics</h4>
        <br>
        <div class="container-fluid" style="text-align: center;">
            <div  v-if="tracker_type=='Numerical'">
            <div class="col">
                <span class="col-1"><strong>Max</strong></span>
                <span class="col-2">{{max}}</span>
            </div>
            <div class="col">
                <span class="col-1"><strong>Min</strong></span>
                <span class="col-2">{{min}}</span>
            </div>
            <div class="col">
                <span class="col-1"><strong>Average</strong></span>
                <span class="col-2">{{avg}}</span>
            </div>
            </div>
            <div v-else-if="tracker_type=='Time Duration'">
            <div class="col" >
                <span class="col-1"><strong>Max Time Duration </strong></span>
                <span class="col-2">{{max_hr}} hr {{max_min}} min</span>
            </div>
            <div class="col">
                <span class="col-1"><strong>Min Time Duration </strong></span>
                <span class="col-2">{{min_hr}} hr {{min_min}} min</span>
            </div>
            <div class="col">
                <span class="col-1"><strong>Average Time Duration </strong></span>
                <span class="col-2">{{avg_hr}} hr {{avg_min}} min</span>
            </div>
            </div>

            <div v-else-if="tracker_type=='Boolean'"> 
            <div class="col">
                <span class="col-1"><strong>{{tracker_name}} True Count: </strong></span>
                <span class="col-2">{{t_count}}</span>
            </div>
            <div class="col">
                <span class="col-1"><strong>{{tracker_name}} False Count: </strong></span>
                <span class="col-2">{{f_count}}</span>
            </div>
            </div>

            <div v-else="tracker_type=='Multiple Choice'">
            <div class="col">
                <span class="col-1"><strong>Choice selected maximum times</strong></span>
    
                    <span class="col-2">{{maxkey}}</span>

                <span class="col-2"><strong>Value: </strong>{{max}}</span>
            </div>
            <div class="col">
                <span class="col-1"><strong>Choice selected minimum times</strong></span>

                    <span class="col-1">{{minkey}}</span>

                <span class="col-2"><strong>Value: </strong>{{min}}</span>
            </div>
            </div>
    </div>
</div>
    </div>`,
    method:{
        logout: async function(){
            try{
                url="http://127.0.0.1:5000/api/logout"
                res= await fetch(url)
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                this.$router.push("/")
            }
            catch(err){
                this.error(err)
                console.log(err)
            }
        }
    },
    mounted: async function(){
        url="http://127.0.0.1:5000/api/tracker"
        r=await fetch(url)
        data= await r.json()
        for(var i=0;i<data.length;i++){
            if(data[i].id===this.$id){
                this.tracker_name=data[i].tracker_name
                this.tracker_type=data[i].tracker_type
            }
        }
        // console.log(this.tracker_type)
        url="http://127.0.0.1:5000/api/log/"+this.$id
        // console.log(url)
        r=await fetch(url)
        data= await r.json()

        for(var i=0;i<data.length;i++){
            if(this.tracker_type==="Numerical"){
                if(this.max<data[i].value){
                    this.max=data[i].value
                }
                if(this.min>data[i].value){
                    this.min=data[i].value
                }
                this.sum+=data[i].value*1
                this.count+=1
            }
            if(this.tracker_type==="Time Duration"){
                hr=data[i].value.split(":")[0]
                min=data[i].value.split(":")[1]
                t=60*hr+min*1
                if(this.max<t){
                    this.max=t
                }
                if(this.min>t){
                    this.min=t
                }
                this.sum=t*1
                this.count+=1
            }
            if(this.tracker_type==="Boolean"){
                if(data[i].value=="True"){
                    this.t_count+=1
                }
                if(data[i].value=="False"){
                    this.f_count+=1
                }
            }
            if(this.tracker_type==="Multiple Choice"){
                if(this.d.hasOwnProperty(data[i].value)){
                    this.d[data[i].value]+=1
                }
                else{
                    this.d[data[i].value]=1
                }
                console.log(this.d)
                if(this.max<this.d[data[i].value]){
                    this.max=this.d[data[i].value]
                }
                if(this.min>this.d[data[i].value]){
                    this.min=this.d[data[i].value]
                }
            }
            
        }
        for(var i=0;i<data.length;i++){
            if(this.d[data[i].value]==this.max){
                this.maxkey.push(data[i].value)
            }
            if(this.d[data[i].value]==this.min){
                this.minkey.push(data[i].value)
            }
        }
        this.max_hr=Math.floor(this.max/60)
        this.max_min=this.max%60
        this.min_hr=Math.floor(this.min/60)
        this.min_min=this.min%60
        this.avg=this.sum/this.count
        this.avg_hr=Math.floor(this.avg/60)
        this.avg_min=Math.floor(this.avg%60)
        // console.log(this.sum)


    }
})
// -----------------------------------------------------------------------------------------------------------------------------
                                                // Trackers
// -----------------------------------------------------------------------------------------------------------------------------
const messageBoard=Vue.component('message-board',{
    data: function(){
        return{
            trackers: [],
            show:false,
            error:""
        }
    },
    template:`
    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid ">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" to="/createTracker">Create Tracker</router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="/export/tracker" id="export" @click=show_msg()>Export</a>
              </li>
              
              <li class="nav-item">
                <a href="#" class="nav-link active" aria-current="page" @click=logout()>Logout</a>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto">
              <form method="POST" action="/report-format" id="report-formar">
                <li class="nav-item">
                <label class="form-label">Monthly Report Format</label>
                <select name="format">
                    <option value="HTML">HTML</option>
                    <option value="PDF">PDF</option>
                </select>
              </li>
            <li class="nav-item">
            <button type="submit" class="btn btn-primary" >Submit</button>
          </li>
    </form>
            </ul>
            </div>
        </div>
    </nav>

<div id="msg" v-show="show">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Download will automatically complete in few seconds. Please continue with your work.</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
  </div>
<div class="msg" v-if="error">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>{{error}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <div class="row">
        <div v-for="track in trackers" class="col"> 
            <div class="card" :id=" track['tracker_type'] ">
                <div class="card-body" >
                    <p class="card-text"><b>Id:</b> {{ track['id'] }}</p>
                    <h4 class="card-title">Name: {{ track['tracker_name'] }}</h4>
                    <p class="card-text"><b>Description:</b> {{ track['description'] }}</p>
                    <p class="card-text"><b>Tracker Type:</b> {{ track['tracker_type'] }}</p>
                    <p class="card-text"><b>Last Updated Time:</b>{{ track['time'] }}</p>
                    <p class="card-text"><b>Last Updated Value:</b> {{ track['value'] }}</p>

                    <router-link to="/logging"><button class="btn btn-primary" @click=send_id(track.id)>View Log</button></router-link>
                    <router-link to="/addlog"><button class="btn btn-primary" @click=send_id(track.id)>Add Log</button></router-link>
                    <router-link to="/editTracker"><button class="btn btn-primary" @click=send_id(track.id)>Edit</button></router-link>
                    <button class="btn btn-danger" @click=delete_tracker(track.id)>Delete</button>
                </div>
            </div>

        </div>
    </div>
    <br>
    </div>
    `,
    methods:{
        send_id: function(id){
            Vue.prototype.$id=id
            console.log(this.$id)
        },
        show_msg: function(){
            this.show=true
        },
        delete_tracker: async function(tracker_id) {
            url="http://127.0.0.1:5000/api/tracker/"+tracker_id
            const r=await fetch(url,{method: "delete"})
            const result= await r.json()

            url="http://127.0.0.1:5000/api/tracker"
            res=await fetch(url)
            data= await res.json()
            this.trackers=data
        },
        logout: async function(){
            try{
                url="http://127.0.0.1:5000/api/logout"
                res= await fetch(url)
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                this.$router.push("/")
            }
            catch(err){
                this.error(err)
                console.log(err)
            }
        }


    },
    mounted: async function(){
        url="http://127.0.0.1:5000/api/tracker"
        r=await fetch(url)
        data= await r.json()
        this.trackers=data
    }
    })

// =====================================================================================================================
                                                // Create Tracker
// =====================================================================================================================

const createTracker=Vue.component('create-tracker',{
    data: function(){
        return{
            error:"",
            msg:"",
            tracker_type:"",
            choices:""
        }
    },
    template:`

    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid ">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" to="/dash">Dashboard</router-link>
              </li>
              
              <li class="nav-item">
                <a href="#" class="nav-link active" aria-current="page" @click=logout()>Logout</a>
              </li>
            </ul>
            </div>
        </div>
    </nav>
    <div class="msg" v-if="error">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>{{error}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    <div class="msg" v-if="msg">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>{{msg}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
        <div class="container-fluid">
            <div class="col">
                <label class="col-3 form-label">Name of the Tracker</label>
                <input class="col-3" type="text" ref="tracker_name" required />
            </div>
            <div class="col form-group">
                <label class="col-3 form-label">Description</label>
                <input class="col-3" type="text" name="desc" ref="desc" id="desc" minlength="4" required>
            </div>
            <div class="col">
                <label class="col-3 form-label" >Tracker Type</label>
                <select name="type" id="type" ref="type" v-model="tracker_type">
                    <option value="Numerical">Numerical</option>
                    <option value="Multiple Choice" >Multiple Choice</option>
                    <option value="Time Duration">Time Duration</option>
                    <option value="Boolean">Boolean</option>
                </select>
            </div>
            <p id='choiceblock' v-if="tracker_type=='Multiple Choice'">
                <label class="col-3" for="choices">Choices For Multiple Choice (Write each choice in single line.)</label>
                <textarea class="col-3" v-model="choices" name="choices" id="choices" value=""></textarea>
            </p>

            <button type="submit" class="btn btn-primary" @click=createTracker()>Create</button>
        </div>
    </div>`,
    methods:{
        createTracker: async function(){
            name=this.$refs.tracker_name.value
            desc=this.$refs.desc.value
            type=this.$refs.type.value
            choice=this.choices
            // console.log(choice)

            if(name===""){
                this.error="Please Enter Tracker Name"
            }
            if(desc===""){
                this.error="Please Enter Tracker Description"
            }
            const postData={
                tracker_name: name,
                description : desc,
                tracker_type: type,
                choices: choice, 
            }
            try{
                url="http://127.0.0.1:5000/api/tracker"
                const res= await fetch(url,{
                    method:"post",
                headers: {
                    "Content-Type": "application/json",},
                    body: JSON.stringify(postData),
                })
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                else{
                    this.msg="Added Successfully";
                }
            }
            catch(err){
                this.postData=err.message
            }
        },
        logout: async function(){
            try{
                url="http://127.0.0.1:5000/api/logout"
                res= await fetch(url)
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                this.$router.push("/")
            }
            catch(err){
                this.error(err)
                console.log(err)
            }
        }
    }

})

// -----------------------------------------------------------------------------------------------------------------------------
                                                // Edit Tracker
// -----------------------------------------------------------------------------------------------------------------------------

const editTracker=Vue.component('edit-tracker',{
    data: function(){
        return{
            error:"",
            msg:"",
            tracker_name: "",
            desc:"",
            tracker_type:"",
            choice:[]
        }
    },
    template:`

    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid ">
          <a class="navbar-brand" href="#">Self Care App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" to="/dash">Dashboard</router-link>
              </li>
              
              <li class="nav-item">
                <a href="#" class="nav-link active" aria-current="page" @click=logout()>Logout</a>
              </li>
            </ul>
            </div>
        </div>
    </nav>
    <div class="msg" v-if="error">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>{{error}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    <div class="msg" v-if="msg">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>{{msg}}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
        <div class="container-fluid">
            <div class="col">
                <label class="col-3 form-label">Name of the Tracker</label>
                <input class="col-3" type="text" ref="tracker_name" :value=tracker_name required />
            </div>
            <div class="col form-group">
                <label class="col-3 form-label">Description</label>
                <input class="col-3" type="text" name="desc" ref="desc" :value=desc minlength="4" required>
            </div>
            <div class="col">
                <label class="col-3 form-label">Tracker Type</label>
                <select name="type" id="type" ref="type" :value=tracker_type v-model=tracker_type>
                    <option value="Numerical">Numerical</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Time Duration">Time Duration</option>
                    <option value="Boolean">Boolean</option>
                </select>
            </div>
            <p id='choiceblock' v-if="tracker_type=='Multiple Choice'">
                <label class="col-3" for="choices">Choices For Multiple Choice (Write each choice in single line.)</label>
                <textarea class="col-3" ref="choice" name="choices"  :value=choice></textarea>
            </p>

            <button type="submit" class="btn btn-primary" @click=editTracker()>Submit</button>
        </div>
    </div>`,
    methods:{
        editTracker: async function(){
            name=this.$refs.tracker_name.value
            desc=this.$refs.desc.value
            type=this.$refs.type.value
            if(type==='Multiple Choice'){
            choice=this.$refs.choice.value
        }
            else{
                choice=''
            }
            // console.log(choice)
            if(name===""){
                this.error="Please Enter Tracker Name"
            }
            if(desc===""){
                this.error="Please Enter Tracker Description"
            }
            const putData={
                tracker_name: name,
                description : desc,
                tracker_type: type,
                choices: choice, 
            }
            try{
                url="http://127.0.0.1:5000/api/tracker/"+this.$id
                const res= await fetch(url,{
                    method:"put",
                headers: {
                    "Content-Type": "application/json",},
                    body: JSON.stringify(putData),
                })
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                else{
                    this.msg="Editted Successfully";
                }
            }
            catch(err){
                this.postData=err.message
            }
        },
        logout: async function(){
            try{
                url="http://127.0.0.1:5000/api/logout"
                res= await fetch(url)
                if (!res.ok) {
                  this.error = `An error has occured: ${res.status} - ${res.statusText}`;
                  throw new Error(this.error);
                }
                this.$router.push("/")
            }
            catch(err){
                this.error(err)
                console.log(err)
            }
        }
    },
    mounted:async function(){
        url="http://127.0.0.1:5000/api/tracker"
        res= await fetch(url)
        data= await res.json()
        for(var i=0; i<data.length;i++){
            if(data[i].id===this.$id){
                this.tracker_name=data[i].tracker_name
                this.desc=data[i].description
                this.tracker_type=data[i].tracker_type

                break
            }
        }
        if(this.tracker_type==="Multiple Choice"){
            url="http://127.0.0.1:5000/api/choices/"+this.$id
            r=await fetch(url)
            
            result=await r.json()
            // console.log(result)
            for(var i=0;i<result.length;i++){
                this.choice.push(result[i].choice)
            }
            // console.log(this.choice)

        }
    }

})


// -----------------------------------------------------------------------------------------------------------------------------
                                                // Routers
// -----------------------------------------------------------------------------------------------------------------------------
const routes = [{path:'/dash', component: messageBoard},
{ path: '/logging', component: logs },
{path: '/createTracker', component: createTracker},
{path: '/addlog', component: addLog},
{path: '/editlog', component:editLog},
{path: '/editTracker', component:editTracker},
{path:'/stats', component:stats},
{path: '/', component:Login},
{path: '/signup', component:signup}]

const router=new VueRouter({
    routes,
})

var app = new Vue({
    el: "#app",
    data:{
        id:0
    },
    router: router,
    
})
