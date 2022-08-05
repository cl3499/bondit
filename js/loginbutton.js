
// This logs the user in by phone num on button click
const btn0 = document.getElementById('btn_login');
btn0.addEventListener('click', function(){
  if (document.getElementById('container_loginbtnmode').innerHTML === '0'){
    // Gets the user's number and formats is as necessary
    var user_num = document.querySelector('input').value
    user_num = user_num.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').replace('/', '')

    //Sends the verification code via text message
    postData('https://dev.bondit.io/verification', {countryNumber: '+1', mobile:'8032806174'}, 'POST').then(res => {
      if (res.sucess === false){
        alert('Unable to send verification code. Please check your internet connection.')
        location.href = 'bondit-main/loginpage2.html'
      }
    })

    // Changes the input field
    document.getElementById('form_header').textContent = 'Enter Verification Code'
    document.getElementById('form_phonenumber').value = ''
    document.getElementById('form_phonenumber').placeholder = 'Enter you verification code'

    // Changes the tab on the left
    document.getElementById('tab1').className = 'ti-comment-alt'
    document.getElementById('tab1_div').textContent = 'Check your mobile device for a verification code and enter it here!'
    document.getElementById('tab1_header').textContent = 'One Last Step'

    // Changes the button
    document.getElementById('btn_login').textContent = 'Enter'

    // Stores the values in hidden <p>
    document.getElementById('container_loginbtnmode').innerHTML = '1'

  } 

  else if (document.getElementById('container_loginbtnmode').innerHTML === '1') {
    var data = {countryNumber: '+1', mobile:'8032806174', code: document.getElementById('form_phonenumber').value.trim()}

    postData('https://dev.bondit.io/verification', data, 'PUT').then(res => {
      if (res.sucess === false){
        if (res.error === 'FORM_INVALID_VERIFICATION'){
          alert('Invalid verification code!')
        }
        else{
          alert('Invalid verification code.')
        }
      }
      else{
        var token = 'JWT ' + res.authentication.token
        callSched('https://dev.bondit.io/user/timetable', {Authorization:token}).then(arg => {
          if (arg.statusCode != undefined){
            if (arg.statusCode === 403){
              alert('Error: Forbidden')
            }
          }
          else if (arg[0].userLectures.length === 0){
            alert('Your account doesn\'t have a schedule!')
          }
          else{
            var user_classes = arg[0].userLectures
            var args = []
            
            // Parses the times into the proper format
            for (var i=0; i<user_classes.length; i++){
              args.push ({name:'Title', time:'Time', room:'Toom'})
              args[i].name = user_classes[i].lecture.name
              args[i].room = user_classes[i].lecture.room
              
              var user_sched_times = ''
              for (var ii=0; ii<user_classes[i].lecture.time.length; ii++){
                var ph = ''
                if (user_classes[i].lecture.time[ii].label == 'Mon'){
                  ph += 'Mo/'
                }
                else if (user_classes[i].lecture.time[ii].label == 'Tue'){
                  ph += 'Tu/'
                }
                else if (user_classes[i].lecture.time[ii].label == 'Wed'){
                  ph += 'We/'
                }
                else if (user_classes[i].lecture.time[ii].label == 'Thu'){
                  ph += 'Th/'
                }
                else if (user_classes[i].lecture.time[ii].label == 'Fri'){
                  ph += 'Fr/'
                }

                if (user_classes[i].lecture.time[ii].startMin === 0){
                  ph += user_classes[i].lecture.time[ii].startHour.toString() + ':00'
                }
                else{
                  ph += user_classes[i].lecture.time[ii].startHour.toString() + ':' + user_classes[i].lecture.time[ii].startMin.toString()
                }
                ph += '-'
                if (user_classes[i].lecture.time[ii].endMin === 0){
                  ph += user_classes[i].lecture.time[ii].endHour.toString() + ':00'
                }
                else{
                  ph += user_classes[i].lecture.time[ii].endHour.toString() + ':' + user_classes[i].lecture.time[ii].endMin.toString()
                }
                user_sched_times += ph + ','
              }
              user_sched_times = user_sched_times.trim(',')

              args[i].time = user_sched_times

            }

            // Renders the schedule
            document.getElementById('user_schedule').hidden = false
            document.getElementById('Title_h2').innerHTML = 'Download you schedule below!'
            document.getElementById('subtitle_p').innerHTML = ''
            document.getElementById('login_ui').hidden = true
            document.getElementById('button_hider').hidden = false
      
            var begenning_time =  getEarliestTime(args)
            var ending_time = getLatestTime(args)
            modifyTimeLabels(begenning_time)
            extendTimeLabels(begenning_time, ending_time)
            rendersched(args, begenning_time)
          }
        })
      }
    })

  }

})

async function postData(url = '', data = {}, mode = 'POST') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: mode, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function callSched(url = '', headers = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: headers,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function decrypt (code) {
    function FindChar (x, keys) {
        for (var i = 0; i < keys.length - 1; i++) {
          if (x === keys[i][1][0] || x === keys[i][1][1]) {
            return keys[i][0]
          }
        }
    }
    var keys = [[' ', [1043401, 9957599]], ['o', [1062601, 9935399]], ['e', [1082801, 9927299]], ['a', [1092901, 9923299]], ['s', [1114111, 9919199]], ['t', [1120211, 9916199]], ['\n', [1134311, 9896989]], ['r', [1160611, 9852589]], ['i', [1177711, 9836389]], ['n', [1190911, 9809089]], ['l', [1208021, 9788879]], ['c', [1221221, 9779779]], ['h', [1242421, 9770779]], ['d', [1257521, 9749479]], ['p', [1268621, 9733379]], ['b', [1280821, 9714179]], ['m', [1303031, 9670769]], ['u', [1333331, 9632369]], ['k', [1343431, 9620269]], ['f', [1371731, 9601069]], [',', [1411141, 9561659]], ['g', [1422241, 9556559]], ['y', [1456541, 9504059]], ['w', [1486841, 9470749]], ['.', [1496941, 9440449]], ['v', [1513151, 9433349]], ['0', [1535351, 9400049]], ['A', [1550551, 9375739]], ['I', [1556551, 9351539]], ['x', [1580851, 9320239]], ['-', [1597951, 9280829]], ['(', [1611161, 9255529]], [')', [1640461, 9217129]], ['j', [1646461, 9209029]], ['1', [1660661, 9185819]], ['T', [1685861, 9173719]], ['B', [1707071, 9128219]], ['z', [1734371, 9103019]], ['[', [1748471, 9091909]], [']', [1777771, 9067609]], ['q', [1820281, 9043409]], ["'", [1829281, 9015109]], ['P', [1851581, 7985897]], ['S', [1865681, 7960697]], ['"', [1878781, 7957597]], ['2', [1884881, 7935397]], ['E', [1903091, 7930397]], ['L', [1924291, 7891987]], ['G', [1951591, 7867687]], ['3', [1963691, 7843487]], ['Q', [1969691, 7832387]], ['W', [1984891, 7807087]], ['R', [1988891, 7791977]], ['Y', [3001003, 7774777]], ['U', [3016103, 7758577]], ['O', [3073703, 7729277]], ['D', [3095903, 7693967]], ['F', [3135313, 7669667]], ['H', [3155513, 7666667]], ['J', [3181813, 7644467]], ['K', [3211123, 7611167]], ['Z', [3218123, 7594957]], ['X', [3236323, 7562657]], ['C', [3256523, 7519157]], ['V', [3267623, 7507057]], ['N', [3285823, 7486847]], ['M', [3291923, 7472747]], ['4', [3305033, 7452547]], ['5', [3321233, 7409047]], ['6', [3331333, 7401047]], ['7', [3362633, 7365637]], ['8', [3365633, 7354537]], ['9', [3400043, 7314137]], [' ', [3424243, 7300037]], ['!', [3427243, 7278727]], ['@', [3441443, 7267627]], ['#', [3444443, 7257527]], ['$', [3449443, 7250527]], ['%', [3466643, 7226227]], ['^', [3487843, 7177717]], ['&', [3515153, 7158517]], ['*', [3558553, 7136317]], ['>', [3569653, 7129217]], ['<', [3591953, 7100017]], ['/', [3601063, 7093907]], ['?', [3627263, 7079707]], [';', [3646463, 7065607]], [':', [3673763, 7046407]], ['{', [3708073, 7014107]], ['}', [3716173, 3997993]], ['=', [3728273, 3970793]], ['+', [3762673, 3942493]], ['_', [3769673, 3924293]], ['|', [3784873, 3899983]]]
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
  
function encrypt (text) {
  function getRandomInt (min, max) {
    max = max + 1
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }
  var charecters = [' ', 'o', 'e', 'a', 's', 't', '\n', 'r', 'i', 'n', 'l', 'c', 'h', 'd', 'p', 'b', 'm', 'u', 'k', 'f', ',', 'g', 'y', 'w', '.', 'v', '0', 'A', 'I', 'x', '-', '(', ')', 'j', '1', 'T', 'B', 'z', '[', ']', 'q', "'", 'P', 'S', '"', '2', 'E', 'L', 'G', '3', 'Q', 'W', 'R', 'Y', 'U', 'O', 'D', 'F', 'H', 'J', 'K', 'Z', 'X', 'C', 'V', 'N', 'M', '4', '5', '6', '7', '8', '9', ' ', '!', '@', '#', '$', '%', '^', '&', '*', '>', '<', '/', '?', ';', ':', '{', '}', '=', '+', '_', '|'];
  var keys = [[' ', [1043401, 9957599]], ['o', [1062601, 9935399]], ['e', [1082801, 9927299]], ['a', [1092901, 9923299]], ['s', [1114111, 9919199]], ['t', [1120211, 9916199]], ['\n', [1134311, 9896989]], ['r', [1160611, 9852589]], ['i', [1177711, 9836389]], ['n', [1190911, 9809089]], ['l', [1208021, 9788879]], ['c', [1221221, 9779779]], ['h', [1242421, 9770779]], ['d', [1257521, 9749479]], ['p', [1268621, 9733379]], ['b', [1280821, 9714179]], ['m', [1303031, 9670769]], ['u', [1333331, 9632369]], ['k', [1343431, 9620269]], ['f', [1371731, 9601069]], [',', [1411141, 9561659]], ['g', [1422241, 9556559]], ['y', [1456541, 9504059]], ['w', [1486841, 9470749]], ['.', [1496941, 9440449]], ['v', [1513151, 9433349]], ['0', [1535351, 9400049]], ['A', [1550551, 9375739]], ['I', [1556551, 9351539]], ['x', [1580851, 9320239]], ['-', [1597951, 9280829]], ['(', [1611161, 9255529]], [')', [1640461, 9217129]], ['j', [1646461, 9209029]], ['1', [1660661, 9185819]], ['T', [1685861, 9173719]], ['B', [1707071, 9128219]], ['z', [1734371, 9103019]], ['[', [1748471, 9091909]], [']', [1777771, 9067609]], ['q', [1820281, 9043409]], ["'", [1829281, 9015109]], ['P', [1851581, 7985897]], ['S', [1865681, 7960697]], ['"', [1878781, 7957597]], ['2', [1884881, 7935397]], ['E', [1903091, 7930397]], ['L', [1924291, 7891987]], ['G', [1951591, 7867687]], ['3', [1963691, 7843487]], ['Q', [1969691, 7832387]], ['W', [1984891, 7807087]], ['R', [1988891, 7791977]], ['Y', [3001003, 7774777]], ['U', [3016103, 7758577]], ['O', [3073703, 7729277]], ['D', [3095903, 7693967]], ['F', [3135313, 7669667]], ['H', [3155513, 7666667]], ['J', [3181813, 7644467]], ['K', [3211123, 7611167]], ['Z', [3218123, 7594957]], ['X', [3236323, 7562657]], ['C', [3256523, 7519157]], ['V', [3267623, 7507057]], ['N', [3285823, 7486847]], ['M', [3291923, 7472747]], ['4', [3305033, 7452547]], ['5', [3321233, 7409047]], ['6', [3331333, 7401047]], ['7', [3362633, 7365637]], ['8', [3365633, 7354537]], ['9', [3400043, 7314137]], [' ', [3424243, 7300037]], ['!', [3427243, 7278727]], ['@', [3441443, 7267627]], ['#', [3444443, 7257527]], ['$', [3449443, 7250527]], ['%', [3466643, 7226227]], ['^', [3487843, 7177717]], ['&', [3515153, 7158517]], ['*', [3558553, 7136317]], ['>', [3569653, 7129217]], ['<', [3591953, 7100017]], ['/', [3601063, 7093907]], ['?', [3627263, 7079707]], [';', [3646463, 7065607]], [':', [3673763, 7046407]], ['{', [3708073, 7014107]], ['}', [3716173, 3997993]], ['=', [3728273, 3970793]], ['+', [3762673, 3942493]], ['_', [3769673, 3924293]], ['|', [3784873, 3899983]]];

  if (keys.length !== charecters.length) {
    console.log('Error: "keys" and "charecter" are not parallel.')
    return ''
  }
  if (text.length % 2 === 1) {
    text += ' '
  }

  var EncryptedText = ''
  for (var i = 0; i < text.length - 1; i += 2) {
    var a1 = keys[charecters.indexOf(text[i])][1][0]
    var b1 = keys[charecters.indexOf(text[i + 1])][1][0]
    var b2 = keys[charecters.indexOf(text[i + 1])][1][1]

    if (a1 < b1 && a1 < b2) {
      var x = getRandomInt(1, 2)
      if (x === 1) {
        EncryptedText += (a1 * b1).toString() + ','
      } // end of nested if
      else {
        EncryptedText += (a1 * b2).toString() + ','
      } // end of nested else
    } // end of if
    else {
      EncryptedText += (a1 * b2).toString() + ','
    } // end of else
  } // end of 'i' if statement
  return EncryptedText.slice(0, EncryptedText.length - 1) 
} 

function rendersched(args, earliest_time=8){
  var colors = ['darkgreen', 'goldenrod', 'grey', 'slateblue', 'saddlebrown', 'purple', 'darkorange', 'darkred', 'blue']
  var ph = {name:'', time:'', room:'', color:''}
  for (var i=0; i<args.length; i++){
    ph = {name:'', time:'', room:'', color:''}
    ph.name = args[i].name
    ph.time = args[i].time
    ph.room = args[i].room
    ph.color = colors.pop(genRandomInt(0, colors.length-1))
    args[i] = ph
  }

  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr']
  const htmldays = ['mon', 'tue', 'wed', 'thur', 'fri']
  var lowerbound = -1
  var min = [25.00, -1, -1] // [min value, lower bound, args index] aka [course start time, course end time, args index]
  try{
    for (var i=0; i<days.length; i++){ // Adds the course blocks for each day/column
      var courseblocknum = 1
      lowerbound = -1
      var added = true
      while (added){ // gets all the times in days[i]
        min = [25.00, -1, -1]
        added = false
        for (var ii=0; ii<args.length; ii++){ // gets the earliest time in args[ii] that hasn't already been chosen

          if (args[ii].time.includes(days[i])){
            var [start_time, end_time] = getTimes(args[ii].time, days[i])
   
            if (parseFloat(start_time) < parseFloat(min[0]) && parseFloat(start_time) > parseFloat(lowerbound)){
              min[0] = start_time
              min[1] = end_time
              min[2] = ii
              added = true
            }
          }
        }

        if (min[0] !== 25){ // Modifies the html to render the course block
          if (lowerbound === -1){
            document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}`).style.height = `${(min[0]-earliest_time).toFixed(2) * 3}cm`
          }
          else{
            document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}`).style.height = `${(min[0]-lowerbound).toFixed(2) * 3}cm`
          }
          courseblocknum += 1

          

          document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}`).style.height = `${(min[1]-min[0]).toFixed(2) * 3}cm`
          document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}`).style.backgroundColor = args[min[2]].color
          document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}_title`).innerHTML = args[min[2]].name
          document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}_time`).innerHTML = parseTime(args[min[2]].time, days[i])
          document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}_room`).innerHTML = args[min[2]].room
          if (args[min[2]].name.length > 20 && (min[1]-min[0]).toFixed(2) < 1.25){ // If it wouldn't fit in the box, this reduces the font
            document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}_title`).style.fontSize = '15px'
            document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}_time`).style.fontSize = '15px'
            document.getElementById(`${htmldays[i]}_courseblock${courseblocknum}_room`).style.fontSize = '15px'
          }
          courseblocknum += 1
          
          lowerbound = min[1]
          
        }
      }

    }
  }
  catch(err){
    alert(err.toString())
  }
}

function modifyTimeLabels(earliest_time){
  const labels = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM']
  earliest_time = earliest_time.toString()
  earliest_time = earliest_time.toUpperCase()
  if (earliest_time.includes('AM')){
    earliest_time = earliest_time.replace('AM', '')
    earliest_time = earliest_time.trim()
    earliest_time = earliest_time + ' AM'
  }
  else if (earliest_time.includes('PM')){
    earliest_time = earliest_time.replace('PM', '')
    earliest_time = earliest_time.trim()
    earliest_time = earliest_time + ' PM'
  }
  else if (earliest_time.includes(':')){
    ph = parseFloat(earliest_time.replace(':', '.'))
    if (ph >= 13){
      ph = ph-12
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' PM'
    }
    else if (ph >= 12 && ph < 13){
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' PM'
    }
    else{
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' AM'
    }
  }
  else if (earliest_time.includes('.')){
    ph = earliest_time.split('.')
    if (ph[1].length === 1){ph[1] += '0'}
    ph[1] = (parseInt(ph[1]) * 60 * 0.01).toFixed(0)
    ph[1] = ph[1].toString()
    if (ph[1].length === 1){ph[1] += '0'}
    earliest_time = ph[0] + ':' + ph[1]

    ph = parseFloat(earliest_time.replace(':', '.'))
    if (ph >= 13){
      ph = ph-12
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' PM'
    }
    else if (ph >= 12 && ph < 13){
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' PM'
    }
    else{
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' AM'
    }
  }
  else{
    if (earliest_time.includes('.') === false){
      earliest_time += '.00'
    }
    ph = earliest_time.split('.')
    if (ph[1].length === 1){ph[1] += '0'}
    ph[1] = (parseInt(ph[1]) * 60 * 0.01).toFixed(0)
    ph[1] = ph[1].toString()
    if (ph[1].length === 1){ph[1] += '0'}
    earliest_time = ph[0] + ':' + ph[1]
    ph = parseFloat(earliest_time.replace(':', '.'))
    if (ph >= 13){
      ph = ph-12
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' PM'
    }
    else if (ph >= 12 && ph < 13){
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' PM'
    }
    else{
      ph = ph.toFixed(2)
      ph = ph.toString()
      ph = ph.replace('.', ':')
      earliest_time = ph + ' AM'
    }
  }

  var i = 0
  var counter = 0
  var modify = false
  while (counter < 12){
    if (modify===false && labels[i] == earliest_time){
      modify = true
      counter += 1
      document.getElementById(`time_label${counter}`).innerHTML = labels[i]
    }
    else if (modify && labels[i] === undefined){
      counter += 1
      document.getElementById(`time_label${counter}`).innerHTML = ''
    }
    else if (modify){
      counter += 1
      document.getElementById(`time_label${counter}`).innerHTML = labels[i]
    }
    i += 1
  }

}

function extendTimeLabels (earliest_time, latest_time){
  earliest_time = decimalify(earliest_time)
  latest_time = decimalify(latest_time)
  const labels = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM']
  if ((latest_time - earliest_time) >= 12){
    var num_extend = (latest_time - earliest_time) - 11
    var current_latest_time = document.getElementById('time_label12').innerHTML
    document.getElementById('user_schedule').style.height = `${38+(3*num_extend)}cm`
    var label_num = 12
    var add = false
    for (var i=0; i<labels.length; i++){
      if (current_latest_time === labels[i]){add = true}
      else if (add){
        document.getElementById('timelabel_col').innerHTML += `<div id="time_label${label_num}" style="height:3cm; color:black; text-align:right; padding:5px;">${labels[i]}</div>`
        num_extend += -1
        if (num_extend === 0){
          break
        }
      }
    }

  }
}

function getEarliestTime(args){
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr']
  var min = 25
  for (var i=0; i<args.length; i++){
    for (var ii=0; ii<days.length; ii++){
      var [start, end] = getTimes(args[i].time, days[ii])
      if (parseFloat(start) < parseFloat(min)){
        min = start
      }
    }
  }
  if (min >= 9){
    min = Math.round(min)
    min += -1
  }
  else{
    var R = parseInt(min.toString().split('.')[0])
    return R
  }
  return min
}
function getLatestTime(args){
  function modified_getTimes(time, day){
    ph = time.split(',')
    for (var i=0; i<ph.length; i++){
      if (ph[i].includes(day)){
        ph1 = ph[i].split('/')[1]
        start = ph1.split('-')[0]
        start = decimalify(start)
        end = ph1.split('-')[1]
        end = decimalify(end)
        return [start, end, ph1.split('-')[1]]
      }
    }
    return [0,0]
  }
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr']
  var max = 0
  var latetime = ''
  for (var i=0; i<args.length; i++){
    for (var ii=0; ii<days.length; ii++){
      var [start, end, end_time] = modified_getTimes(args[i].time, days[ii])
      if (parseFloat(end) > parseFloat(max)){
        max = end
        latetime = end_time
      }
    }
  }
  if (latetime.split(':')[1].trim() == '00'){
    return parseInt(latetime.split(':')[0]) 
  }
  else{
    return parseInt(latetime.split(':')[0]) + 1
  }
}
function genRandomInt(min, max) {
  max += 1
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function decimalify (arg){
  if (typeof(arg) == typeof(10) ){
    return arg
  }
  else if (arg.includes(':')){
    let ph = arg.split(':')
    var R = 0.0
    R += parseInt(ph[0])
    R += parseFloat(parseInt(ph[1])/60)
    return R.toFixed(2)
  }
}
function parseTime(arg, day){
  var ph = arg.split(',')
  for (var i=0; i<ph.length; i++){
    if (ph[i].includes(day)){
      ph1 = ph[i].split('/')[1]
      ph1 = ph1.split('-')
      for (var ii=0; ii<ph1.length; ii++){
        ph2 = parseFloat(ph1[ii].replace(':', '.'))
        if (ph2 >= 13){
          ph2 = ph2-12
          ph2 = ph2.toFixed(2)
          ph2 = ph2.toString()
          ph2 = ph2.replace('.', ':')
          ph1[ii] = ph2 + ' PM'
        }
        else if (ph2 >= 12 && ph2 < 13){
          ph2 = ph2.toFixed(2)
          ph2 = ph2.toString()
          ph2 = ph2.replace('.', ':')
          ph1[ii] = ph2 + ' PM'
        }
        else{
          ph2 = ph2.toFixed(2)
          ph2 = ph2.toString()
          ph2 = ph2.replace('.', ':')
          ph1[ii] = ph2 + ' AM'
        }
      }
      return (ph1[0] + ' - ' + ph1[1])
    }
  }
}
function getTimes(time, day){
  ph = time.split(',')
  for (var i=0; i<ph.length; i++){
    if (ph[i].includes(day)){
      ph1 = ph[i].split('/')[1]
      start = ph1.split('-')[0]
      start = decimalify(start)
      end = ph1.split('-')[1]
      end = decimalify(end)
      return [start, end]
    }
  }
  return [100, 101]
}
