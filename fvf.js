
//
// MARK:(HTML)
//




//
// Synchronize content between the text containers
// 

// header
const header = 
  div("Font vs Font!")
    .attr("class", "header space");
  
// nav
const start_btn = 
  button("START")
    .attr("class", "nav_button")
    .on_click(start_pvp);

const reset_btn = 
  button("RESET")
    .attr("class", "nav_button")
    .on_click(goto_state_prepare);

const nav = 
  div(
    start_btn, 
    div().attr("class", "nav_button_seperator"),
    reset_btn
  )
  .attr("class", "nav space");


// drop area
const drop_area = 
  div(
    p("Drag and drop font files here for them to participate!"),
    p("(We need at least 2 fonts!)")
  )
  .attr("class", "drop_area space")
  .on_event('drop', (e) => {
    e.preventDefault();

    for (const file of e.dataTransfer.files) {
      const reader = new FileReader();
      const name = remove_extention(file.name);

      // Now we load the file.
      reader.onload = (event) => {
        const font_data = event.target.result;
        const new_font = new FontFace(name, font_data);

        new_font.load().then((loaded_font) => {
          // Adding participants
          document.fonts.add(loaded_font);
          all_participants.push(name);

          participants.style.display = "block";
          participant_list.innerHTML += name + "<br>";


          if (all_participants.length >= 2) {
            start_btn.attr("disabled");
            reset_btn.attr("disabled");
          }
        });
      }

      reader.readAsArrayBuffer(file);
    };

  })
  .on_event('dragleave', () => {
    //drop_area.style.border = '2px dashed #aa9374';
  })
  .on_event('dragover', (e) => {
    e.preventDefault();
    //drop_area.style.border = '2px dashed #aa9374';
  });


// signboard
const signboard = 
  div()
    .attr("class", "signboard space");

// participant list
const participant_list = span().attr("class", "participants_list")
const participants =
  div(
    div("Participating Fonts").attr("class", "participants_header"),
    hr(),
    participant_list
  )
  .attr("class", "participants");

// arena
const fighter_vote_left =
  div("THIS ONE")
    .attr("class", "fighter_vote_button")
    .on_click(() => vote_fighter(0) );

const fighter_vote_right =
  div("THIS ONE")
    .attr("class", "fighter_vote_button")
    .on_click(() => vote_fighter(1) );

const fighter_text_left =
  div("This is some text")
    .attr("class", "fighter_text space")
    .attr("contenteditable", "true")
    .on_event('input', () => {
      fighter_text_right.innerHTML = fighter_text_left.innerHTML; 
    });

const fighter_text_right =
  div("This is some text")
    .attr("class", "fighter_text space")
    .attr("contenteditable", "true")
    .on_event('input', () => {
      fighter_text_left.innerHTML = fighter_text_right.innerHTML; 
    });


const fighter_left = 
  div(
    fighter_vote_left,
    fighter_text_left
  )
  .attr("class", "fighter");

const fighter_right = 
  div(
    fighter_vote_right,
    fighter_text_right
  )
  .attr("class", "fighter");

const arena = 
  div(
    fighter_left,
    div().attr("class", "seperator"),
    fighter_right,
  )
  .attr("class", "arena");

const content = 
  div(
    div("Font vs Font")
      .attr("class", "header space"),
    hr()
      .attr("class", "line"),
    signboard,
    nav,
    drop_area,
    participants,
    arena,
  )
  .attr("class", "content");


const r = router({
  "/" : () => content
});

entry.appendChild(r);


// Fighter html elements

// Buttons

//
// MARK:(Data)
//
let all_participants = [] // all possible participants
let current_participants = []
let next_participants  = []
let fighter_left_name = "";
let fighter_right_name = "";

//
// MARK:(Functions)
//
function goto_state_prepare() {

  all_participants = [];
  document.fonts.clear()
  current_participants = [];

  start_btn.attr("style");
  fighter_right.attr("style");
  fighter_vote_left.attr("style");
  drop_area.attr("style");
  participants.attr("style");
  arena.attr("style");

  start_btn.attr("disabled", "disabled");
  reset_btn.attr("disabled", "disabled");

  arena.style.display = "none";
  participants.style.display = "none";
  participant_list.innerHTML = "";

  set_sign("Choose your fonts");
}

function goto_state_battle() {
  drop_area.style.display = "none";
  arena.style.display = "flex";
  start_btn.attr("disabled", "disabled");

  participants.style.display = "none";
  set_sign("Battle!");
}

function goto_state_win() {

  let winner = current_participants[0];
  set_sign("Winner: " + winner);
  set_left_fighter(winner);

  arena.style.display = "block";
  fighter_right.style.display = "none";
  fighter_vote_left.style.display = "none";
}


//
// Main functions
//
function set_sign(text) {
  signboard.innerHTML = text;
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
  console.log(fighter_left_name);
  console.log(fighter_right_name);
  console.log(next_participants);
}

function vote_fighter(index) {
  if (index == 0)
    next_participants.push(fighter_left_name);
  else if (index == 1) 
    next_participants.push(fighter_right_name);
  advance_pvp_stage();
}

function set_left_fighter(font_name) {
  fighter_left_name = font_name;
  fighter_text_left.style.fontFamily = font_name;
}

function set_right_fighter(font_name) {
  fighter_right_name = font_name;
  fighter_text_right.style.fontFamily = font_name;
}


goto_state_prepare();


