// Still in Development

// Global Variubles
var confimation_code = 'B-' 
var btn_mode = 0
var msg = ''

const btn0 = document.getElementById('btn_login');
btn0.addEventListener('click', function(){
    if (btn_mode === 0){
        var user_num = document.querySelector('input').value
        user_num = user_num.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
        user_num = '+1' + user_num

        // Creates a 6 digit confirmation code
        confimation_code = 'B-'
        for (var i = 0; i < 6; i++){
        confimation_code += (Math.floor(Math.random() * 10)).toString();
        }

        // Creates the outgoing message
        msg = 'This is your Bondit verification code. Do NOT share this with anyone. Our employees will never ask for this information.\n ' + confimation_code

        //SendMessage(msg)//

        // Changes the input field
        document.querySelector('input').value = 'B-'
        document.getElementById('form_header').textContent = 'Enter Verification Code'

        // Changes the tab on the left
        document.getElementById('tab1').className = 'ti-comment-alt'
        document.getElementById('tab1_div').textContent = 'Check your mobile device for a verification code and enter it here!'
        document.getElementById('tab1_header').textContent = 'One Last Step'

        // Changes the button
        document.getElementById('btn_login').textContent = 'Enter'

        // Creates/unhides the resend button
        document.getElementById('btn_resend').className = 'btn grdnt-purple'

        // updates the button mode to check the varificatino code on the bext click
        btn_mode += 1
    }
    else{
        if (document.getElementById('form_phonenumber').value === confimation_code){
            //pass
        }
        else{
            document.querySelector('input').value = 'B-'
            alert('title', 'Incorrect Confirmation code')
        }
    }
})


const btn1 = document.getElementById('btn_login');
btn1.addEventListener('click', function(){
    confimation_code = 'B-'
    for (var i = 0; i < 6; i++){
        confimation_code += (Math.floor(Math.random() * 10)).toString();
    }

    // Creates the outgoing message
    msg = 'This is your Bondit verification code. Do NOT share this with anyone. Our employees will never ask for this information.\n ' + confimation_code


    //SendMessage(msg)//
})








