// Still in Development

// Global Variubles
var confimation_code = 'B-' 
var btn_mode = 0
var msg = ''
const api_auth_token = '2870970771131,15499510681049,10527225712469,1391773670831,1289519621711,11018831158079,12118541128079,11018831158079,10423147780489,1168829277611,10222507459669,10621291378289'
const api_sid = '2870970771131,15499510681049,17446988633059,30827760616897'

// This logs the user in by phone num on button click
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

        // //Sends the verification code via text message
        // const client = require('twilio')(decrypt(api_sid, keys), decrypt(api_auth_token, keys))
        // client.messages.create({
        //     to: user_num,
        //     from: 'placeholder',
        //     body: msg
        // })

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

        // updates the button mode to check the verification code on the bext click
        btn_mode += 1
    }
    else{
        if (document.getElementById('form_phonenumber').value === confimation_code){
            // GetSchedulePng()
        }
        else{
            document.querySelector('input').value = 'B-'
            alert('Your verification code is incorrect!')
        }
    }
})

// This resends the verification code if clicked
const btn1 = document.getElementById('btn_resend');
btn1.addEventListener('click', function(){
    alert('The verification code has been resent!')


    // confimation_code = 'B-'
    // for (var i = 0; i < 6; i++){
    //     confimation_code += (Math.floor(Math.random() * 10)).toString();
    // }

    // // Creates the outgoing message
    // msg = 'This is your Bondit verification code. Do NOT share this with anyone. Our employees will never ask for this information.\n ' + confimation_code

    
    // //SendMessage(msg)//

    
})




var charecters = [' ', 'o', 'e', 'a', 's', 't', '\n', 'r', 'i', 'n', 'l', 'c', 'h', 'd', 'p', 'b', 'm', 'u', 'k', 'f', ',', 'g', 'y', 'w', '.', 'v', '0', 'A', 'I', 'x', '-', '(', ')', 'j', '1', 'T', 'B', 'z', '[', ']', 'q', "'", 'P', 'S', '"', '2', 'E', 'L', 'G', '3', 'Q', 'W', 'R', 'Y', 'U', 'O', 'D', 'F', 'H', 'J', 'K', 'Z', 'X', 'C', 'V', 'N', 'M', '4', '5', '6', '7', '8', '9', ' ', '!', '@', '#', '$', '%', '^', '&', '*', '>', '<', '/', '?', ';', ':', '{', '}', '=', '+', '_', '|'];
var keys = [[' ', [1043401, 9957599]], ['o', [1062601, 9935399]], ['e', [1082801, 9927299]], ['a', [1092901, 9923299]], ['s', [1114111, 9919199]], ['t', [1120211, 9916199]], ['\n', [1134311, 9896989]], ['r', [1160611, 9852589]], ['i', [1177711, 9836389]], ['n', [1190911, 9809089]], ['l', [1208021, 9788879]], ['c', [1221221, 9779779]], ['h', [1242421, 9770779]], ['d', [1257521, 9749479]], ['p', [1268621, 9733379]], ['b', [1280821, 9714179]], ['m', [1303031, 9670769]], ['u', [1333331, 9632369]], ['k', [1343431, 9620269]], ['f', [1371731, 9601069]], [',', [1411141, 9561659]], ['g', [1422241, 9556559]], ['y', [1456541, 9504059]], ['w', [1486841, 9470749]], ['.', [1496941, 9440449]], ['v', [1513151, 9433349]], ['0', [1535351, 9400049]], ['A', [1550551, 9375739]], ['I', [1556551, 9351539]], ['x', [1580851, 9320239]], ['-', [1597951, 9280829]], ['(', [1611161, 9255529]], [')', [1640461, 9217129]], ['j', [1646461, 9209029]], ['1', [1660661, 9185819]], ['T', [1685861, 9173719]], ['B', [1707071, 9128219]], ['z', [1734371, 9103019]], ['[', [1748471, 9091909]], [']', [1777771, 9067609]], ['q', [1820281, 9043409]], ["'", [1829281, 9015109]], ['P', [1851581, 7985897]], ['S', [1865681, 7960697]], ['"', [1878781, 7957597]], ['2', [1884881, 7935397]], ['E', [1903091, 7930397]], ['L', [1924291, 7891987]], ['G', [1951591, 7867687]], ['3', [1963691, 7843487]], ['Q', [1969691, 7832387]], ['W', [1984891, 7807087]], ['R', [1988891, 7791977]], ['Y', [3001003, 7774777]], ['U', [3016103, 7758577]], ['O', [3073703, 7729277]], ['D', [3095903, 7693967]], ['F', [3135313, 7669667]], ['H', [3155513, 7666667]], ['J', [3181813, 7644467]], ['K', [3211123, 7611167]], ['Z', [3218123, 7594957]], ['X', [3236323, 7562657]], ['C', [3256523, 7519157]], ['V', [3267623, 7507057]], ['N', [3285823, 7486847]], ['M', [3291923, 7472747]], ['4', [3305033, 7452547]], ['5', [3321233, 7409047]], ['6', [3331333, 7401047]], ['7', [3362633, 7365637]], ['8', [3365633, 7354537]], ['9', [3400043, 7314137]], [' ', [3424243, 7300037]], ['!', [3427243, 7278727]], ['@', [3441443, 7267627]], ['#', [3444443, 7257527]], ['$', [3449443, 7250527]], ['%', [3466643, 7226227]], ['^', [3487843, 7177717]], ['&', [3515153, 7158517]], ['*', [3558553, 7136317]], ['>', [3569653, 7129217]], ['<', [3591953, 7100017]], ['/', [3601063, 7093907]], ['?', [3627263, 7079707]], [';', [3646463, 7065607]], [':', [3673763, 7046407]], ['{', [3708073, 7014107]], ['}', [3716173, 3997993]], ['=', [3728273, 3970793]], ['+', [3762673, 3942493]], ['_', [3769673, 3924293]], ['|', [3784873, 3899983]]];
function decrypt (code, keys) {
    function FindChar (x, keys) {
        for (var i = 0; i < keys.length - 1; i++) {
          if (x === keys[i][1][0] || x === keys[i][1][1]) {
            return keys[i][0]
          }
        }
    }
    var DecryptedText = ''
    code = code.split(',')
    for (var i = 0; i < code.length; i++) {
      code[i] = parseInt(code[i])
      for (var ii = 0; ii < keys.length; ii++) {
        if (code[i] % keys[ii][1][0] === 0) {
          if ((code[i] / keys[ii][1][0]) > keys[ii][1][0]) {
            DecryptedText += keys[ii][0]
            DecryptedText += FindChar(code[i] / keys[ii][1][0], keys)
            break;
          } // end of nested if
          else {
            DecryptedText += FindChar(code[i] / keys[ii][1][0], keys)
            DecryptedText += keys[ii][0]
            break;
          } // end of nested else
        } // end of if
      } // end of 'ii' if
    } // end of 'i' if
  
    return DecryptedText
}
  


