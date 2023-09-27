

//
// MARK:(HTML)
//
const html_drop_area = document.getElementById('drop-area');
const html_signboard = document.getElementById('signboard');
const html_fighter_text_areas = [document.getElementById('fighter-text-left'), document.getElementById('fighter-text-right')];
const html_arena = document.getElementById('arena');
const html_participant_list = document.getElementById('participant-list');

//
// MARK:(Data)
//
let all_participants = [] // all possible participants
let current_participants = []
let next_participants  = []
let fighters = [] ; // only up to 2

//
// MARK:(States)
//
function goto_state_prepare() {
    html_drop_area.removeAttribute("style");
    html_arena.style.display = "none";
    html_participant_list.removeAttribute("style");
    set_sign("");
    all_participants = [];
    document.fonts.clear()
    current_participants = [];
    html_participant_list.innerHTML = "";
    fighters = ["test", "test"] 
}

function goto_state_battle() {
    html_drop_area.style.display = "none";
    html_arena.style.display = "flex";
    html_arena.style.opacity = 1;
    
    html_participant_list.style.display = "none";
    set_sign("Battle!");
}

function goto_state_win() {
    set_sign("Winner: " + current_participants[0]);
}

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

  set_fighter(0, current_participants.shift());
  set_fighter(1, current_participants.shift());

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
    set_fighter(0, current_participants.shift());
    set_fighter(1, current_participants.shift());
  }

}

function check() {
  console.log(all_participants);
  console.log(current_participants);
  console.log(fighters);
  console.log(next_participants);
}

function vote_fighter(index) {
  if (index == 0 || index == 1) {
    next_participants.push(fighters[index]);
  }
  advance_pvp_stage();
}


function set_fighter(index, font_name) {
  fighters[index] = font_name;
  html_fighter_text_areas[index].style.fontFamily = font_name;
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
html_fighter_text_areas.forEach((e) => {
  e.addEventListener('input', () => {
    html_fighter_text_areas.forEach((ee) => {
      if (e != ee) {
        ee.innerHTML = e.innerHTML;
      }
    });
  });

});

goto_state_prepare();

