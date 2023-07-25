Vue.config.devtools = true
var app= new Vue({
    el: '#login-form',
    delimiters:['${','}'],
    data:{
        error:"",
        error_msg:[],
        username:"",
        password:"",
        re_password:"",
        email:"",
        webhook:""
    },
    methods: {
        check: function(){
            if(this.username.indexOf("'")>-1 ){
                console.log("error"),
                this.error="ERROR"
            }
            console.log(this.username.indexOf("'"))
        }
    },
    watch:{
        username(newuser,old){
            if(newuser.indexOf("'")>-1 || newuser.indexOf('"')>-1){
                this.error="ERROR: Cannot use ' or \" in username or password"
                this.error_msg.push(this.error)
                console.log("error")
            }
            if(newuser.indexOf("'")==-1 && newuser.indexOf('"')==-1){
                this.error=""
                this.error_msg.pop()
            }
        },
        password(newuser,old){
            if(newuser.indexOf("'")>-1 || newuser.indexOf('"')>-1){
                this.error="ERROR: Cannot use ' or \" in username or password"
                this.error_msg.push(this.error)
            }
            if(newuser.indexOf("'")==-1 && newuser.indexOf('"')==-1){
                this.error=""
                this.error_msg.pop()
            }
        },
        re_password(newrepass,old){
            if(newrepass!=this.password){
                this.error="ERROR: Passowrds are not same"
            }
            else{
                this.error=""
            }
        }
    }
})