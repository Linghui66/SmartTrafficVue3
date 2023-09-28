// 获取本地存储的用户名和密码
const getLocalUser=(username,password,type,check,userRemenber)=>{
    // 如果本地存储有"GisUser"的数据
    console.log(11111);
    if(localStorage.getItem("GisUser")){
        // 记住密码勾选框为真值
        check.value=true
        userRemenber.value=true
        // 获取本地存储的用户数据
        const user=JSON.parse(localStorage.getItem("GisUser"))
        // console.log(user,777);
        // 把数据赋值给登录卡片的input框绑定的username、password、type
            username.value=user.username
            password.value=window.atob(user.password)
            type.value=user.type
       }  
}
// 记住密码和用户名功能
const setLocalUser=(remenbered,username,password,type)=>{
    remenbered.value = !remenbered.value;
    if (remenbered.value&&username.value&&password.value&&type.value) {
     // 把用户的名字、密码、用户类型放到item
      const item = {
        remenbered:remenbered.value,
        username: username.value,
        // 密码加密
        password: window.btoa(password.value),
        type:type.value,
      };
      // 把item存储到本地存储  
      localStorage.setItem("GisUser", JSON.stringify(item));
    }else if(!remenbered.value){
      const res=JSON.parse(localStorage.getItem("GisUser"))
      if(username.value===res.username&&password.value===window.atob(res.password)&&type.value===res.type){
        localStorage.removeItem("GisUser")
      }
    }
}
 // 手机号格式校验
const checkInput=(e)=>{
  var reg= /^1[35789][0-9]{9}$/
  var res=reg.test(e)
  return res
}
// 检查是否有重复的名字
const checkName=(username,userList,userRow)=>{
  // console.log(userRow.value,8888);
  const user=userList.value.filter((item)=>item.username !== userRow.value.username)
  // console.log(user,"yyy");
  const res= user.find((item)=>
 item.username===username
   )
   if(res){
    return true
   }else{
    return false
   }
  //  console.log(res,887);
}
// 校验密码
const checkPassword=(e)=>{
  var reg=/^[0-9]{6,12}$/
  var res=reg.test(e)
  // console.log(res,"密码");
  return res
}
export {getLocalUser,setLocalUser,checkInput,checkName,checkPassword}