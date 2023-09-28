

//
// MARK:(HTML)
//
const html_drop_area = document.getElementById('drop-area');
const html_signboard = document.getElementById('signboard');

// Fighter html elements
const html_fighter_text_left = document.getElementById('fighter-text-left');
const html_fighter_text_right = document.getElementById('fighter-text-right');
const html_fighter_left = document.getElementById('fighter-left');
const html_fighter_right = document.getElementById('fighter-right');
const html_fighter_vote_left = document.getElementById('fighter-vote-left');
const html_fighter_vote_right = document.getElementById('fighter-vote-right');

// Buttons
const html_start_btn = document.getElementById('start-btn');
const html_reset_btn = document.getElementById('reset-btn');
const html_check_btn = document.getElementById('check-btn');



const html_arena = document.getElementById('arena');
const html_participant_list = document.getElementById('participant-list');

//
// MARK:(Data)
//
let all_participants = [] // all possible participants
let current_participants = []
let next_participants  = []
let fighter_left = "";
let fighter_right = "";

//
// MARK:(States)
//
function goto_state_prepare() {
  html_start_btn.removeAttribute("style");
  html_fighter_right.removeAttribute("style");
  html_fighter_vote_left.removeAttribute("style");
  html_drop_area.removeAttribute("style");
  html_participant_list.removeAttribute("style");
  html_arena.removeAttribute("style");

  html_arena.style.display = "none";
  set_sign("");
  all_participants = [];
  document.fonts.clear()
  current_participants = [];
  html_participant_list.innerHTML = "";
}

function goto_state_battle() {
  html_drop_area.style.display = "none";
  html_arena.style.display = "flex";
  html_start_btn.style.display = "none";

  html_participant_list.style.display = "none";
  set_sign("Battle!");
}

function goto_state_win() {

  let winner = current_participants[0];
  set_sign("Winner: " + winner);
  set_left_fighter(winner);

  html_arena.style.display = "block";
  html_fighter_right.style.display = "none";
  html_fighter_vote_left.style.display = "none";
}


//
// Main functions
//
function set_sign(text) {
  html_signboard.innerHTML = text;
}

function shuffle_array(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function remove_extention(filename) {
  return filename.substring(0, filename.indexOf('.')) || filename;
}

function start_pvp() {
  // TODO: This whole thing might just be in 'goto_state_battle')
  if (all_participants.length < 2) {
    set_sign("Not enough participants!");
    return;
  }

  current_participants = all_participants.slice();
  next_participants = [];

  shuffle_array(current_participants);

  set_left_fighter(current_participants.shift());
  set_right_fighter(current_participants.shift());

  goto_state_battle();


}

function advance_pvp_stage() {
  if (current_participants.length == 1) {
    next_participants.push(current_participants.shift());    
  }

  if (current_participants.length == 0) {
    current_participants = next_participants.slice();
    next_participants = [];
    shuffle_array(current_participants);
    console.log("NEXT STAGE");
  }

  //
  // WIN CONDITION
  //
  // If after everything, there is only one participant left, that means it's the winner! 
  //
  if (current_participants.length == 1) {
    goto_state_win();
  }
  else {
    set_left_fighter(current_participants.shift());
    set_right_fighter(current_participants.shift());
  }

}

function check() {
  console.log(all_participants);
  console.log(current_participants);
  console.log(fighter_left);
  console.log(fighter_right);
  console.log(next_participants);
}

function vote_fighter(index) {
  if (index == 0)
    next_participants.push(fighter_left);
  else if (index == 1) 
    next_participants.push(fighter_right);
  advance_pvp_stage();
}

function set_left_fighter(font_name) {
  fighter_left = font_name;
  html_fighter_text_left.style.fontFamily = font_name;
}

function set_right_fighter(font_name) {
  fighter_right = font_name;
  html_fighter_text_right.style.fontFamily = font_name;
}

html_drop_area.addEventListener('dragover', (e) => {
  e.preventDefault();
  html_drop_area.style.border = '2px dashed #000';
});

html_drop_area.addEventListener('dragleave', () => {
  html_drop_area.style.border = '2px dashed #ccc';
});


html_drop_area.addEventListener('drop', (e) => {
  e.preventDefault();
  html_drop_area.style.border = '2px dashed #ccc';

  for (const file of e.dataTransfer.files) {
    const reader = new FileReader();
    const name = remove_extention(file.name);

    reader.onload = (event) => {
      const font_data = event.target.result;
      const new_font = new FontFace(name, font_data);

      new_font.load().then((loaded_font) => {
        // Adding participants
        document.fonts.add(loaded_font);
        all_participants.push(name);
        html_participant_list.innerHTML += name + "<br>";

        // TODO: This is terribad; should set only once!
        set_sign("Participants");
      });
    }

    reader.readAsArrayBuffer(file);
  };

});

//
// Synchronize content between the text containers
// 
html_fighter_text_left.addEventListener('input', () => {
  html_fighter_text_right.innerHTML = html_fighter_text_left.innerHTML; 
});

html_fighter_text_right.addEventListener('input', () => {
  html_fighter_text_left.innerHTML = html_fighter_text_right.innerHTML; 
});

goto_state_prepare();

