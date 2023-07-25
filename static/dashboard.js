// import '@./style/dashboard.css';


Vue.component('message-board',{
    props:['color','id','name','description','trackertype', 'lasttime','lastvalue'],
    template:`

    <div class="card" style="width: 28rem;" :id="trackertype">
        <div class="card-body" >
            <p class="card-text"><b>Id:</b> {{id}}</p>
            <h4 class="card-title">Name: {{name}}</h4>
            <p class="card-text"><b>Description:</b> {{description}}</p>
            <p class="card-text"><b>Tracker Type:</b> {{trackertype}}</p>
            <p class="card-text"><b>Last Updated Time:</b> {{lasttime}}</p>
            <p class="card-text"><b>Last Updated Value:</b> {{lastvalue}}</p>

            <a :href="'/logging/'+id" class="btn btn-primary">View Log</a>
            <a :href="'/addlog/'+id" class="btn btn-primary">Add Log</a>
            <a :href="'/edit/'+id" class="btn btn-primary">Edit</a>
            <a :href="'/delete/'+id" class="btn btn-danger">Delete</a>

            
        </div>
    </div>

    `,
    // methods:{
    //     getStyling(styledecider){
    //         if instance.trackertype=="numerical"{
    //             return '#C3F8FF';
    //         }
    //     }
    // }
    })

// const routes = [{ path: '/logging/:id', component: User }]

var app = new Vue({
    el: "#app",
    methods:{
        send_data: function(id){
            url="http://127.0.0.1:5000/api/log"+str(id)
            fetch(url,{
                method: 'GET'
            }).then(r=>r.json()
            ).then(d=>console.log(d)
            ).catch(e=>console.log(e))
        }
    }
})

//             <p class="card-text">Setting(log) (edit) (tracker details)</p>
// <a href="#" class="btn btn-primary">Go somewhere</a>
            // <p>Your name: <input type="text" v-model="visitor_name"></p>
            // <p>Your message: <input type="text" v-model="visitor_message"></p>

// <a :href="'/delete/'+id" class="btn btn-danger">Delete</a>
// <a :href="'/logging/'+id" class="btn btn-primary">View Log</a>

// <button @click="send_data(id)" class="btn btn-primary">View Log</button>