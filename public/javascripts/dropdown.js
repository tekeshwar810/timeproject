function myfunction(){
    var sub = document.getElementById('Sub');
    var icon = document.getElementById('icon')
    if(sub.style.display == 'none'){
        sub.style.display = 'block'
        icon.style.transform = 'rotate(90deg)'
        icon.style.transition='all 0.50s'
        icon.style.color='lightgrey'
        // icon.style.cssText ='transform: rotate(90deg); transition: all 050s; color:lightgrey'
    }
    else{
        sub.style.display = 'none'
        icon.style.transform = 'rotate(0deg)'
        icon.style.transition='all 0.60s'
        icon.style.color='#007bff'
    }
}
function mydrop(){
    var subdrop = document.getElementById('SubDrop')
    if(subdrop.style.display == 'none'){
        subdrop.style.display = 'block'
    }
    else{
        subdrop.style.display = 'none'
    }
}


$(document).ready(function() {
    $("#show_hide_password a").on('click', function(event) {
        event.preventDefault();
        if($('#show_hide_password input').attr("type") == "text"){
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass( "fa-eye-slash" );
            $('#show_hide_password i').removeClass( "fa-eye" );
        }else if($('#show_hide_password input').attr("type") == "password"){
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass( "fa-eye-slash" );
            $('#show_hide_password i').addClass( "fa-eye" );
        }
    });
});

var cartCounter = document.getElementById('cartNum')
console.log(cartCounter.innerText)
function updateCart(time){ 
    axios.post('/customer/updateCart',time).then((result)=>{
            console.log(result)
            cartCounter.innerText = result.data.totalqty
        })
 }

var addToCart=document.querySelectorAll('.Btn')


addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
         let time = JSON.parse(btn.dataset.time)//btn =jis btn per click kr rhe h // dataset = jis btn pr click krenge uska data get krenge // time =attribute jo data-attribute diye he apn n
         updateCart(time)
         
    })
})


