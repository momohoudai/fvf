const drop_area = document.getElementById('drop-area');
const fighters_text_areas = [document.getElementById('fighter-text-left'), document.getElementById('fighter-text-right')];

let all_participants = [] // all possible participants
let current_participants = []
let next_participants  = []
let fighters = ["test", "test"] ; // only up to 2

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
  if (all_participants.length < 2) {
    alert("Die");
    return;
  }
  
  current_participants = all_participants.slice();
  next_participants = [];

  shuffle_array(current_participants);

  set_fighter(0, current_participants.shift());
  set_fighter(1, current_participants.shift());
  
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
    console.log("WINNER: " + current_participants[0]);
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


function clear_participants() {
  all_participants = [] 
  document.fonts.clear()
}

function set_fighter(index, font_name) {
  fighters[index] = font_name;
  fighters_text_areas[index].style.fontFamily = font_name;
}

drop_area.addEventListener('dragover', (e) => {
  e.preventDefault();
  drop_area.style.border = '2px dashed #000';
});

drop_area.addEventListener('dragleave', () => {
  drop_area.style.border = '2px dashed #ccc';
});

drop_area.addEventListener('drop', (e) => {
  e.preventDefault();
  drop_area.style.border = '2px dashed #ccc';
  
  for (const file of e.dataTransfer.files) {
    const reader = new FileReader();
    const name = remove_extention(file.name);

    reader.onload = (event) => {
      const font_data = event.target.result;
      const new_font = new FontFace(name, font_data);

      new_font.load().then((loaded_font) => {
        document.fonts.add(loaded_font);
        all_participants.push(name);

      });
    }

    reader.readAsArrayBuffer(file);
  };


});

//
// Synchronize content between the text containers
// 
fighters_text_areas.forEach((e) => {
  e.addEventListener('input', () => {
    fighters_text_areas.forEach((ee) => {
      if (e != ee) {
        ee.innerHTML = e.innerHTML;
      }
    });
  });

});

console.log(document.fonts);
