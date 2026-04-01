// -------------------- Mock student database with timetable --------------------
const students = [
  {
    roll_no: "28383H",
    name: "HEMANTH",
    age: 20,
    class: "CSE - III Year",
    marks: 89,
    attendance: "95%",
    classroom: "Room 204",
    venue: "Block A",
    timetable: [
      { subject: "Data Structures", start: "09:00", end: "10:00", room: "204" },
      { subject: "Operating Systems", start: "10:00", end: "11:00", room: "204" },
      { subject: "Database Systems", start: "11:15", end: "12:15", room: "205" },
      { subject: "Computer Networks", start: "13:00", end: "14:00", room: "206" },
      { subject: "AI & ML", start: "14:15", end: "15:15", room: "207" }
    ]
  },
  {
    roll_no: "28782Y",
    name: "YASWANTH",
    age: 19,
    class: "CSE - II Year",
    marks: 92,
    attendance: "98%",
    classroom: "Room 102",
    venue: "Block B",
    timetable: [
      { subject: "C Programming", start: "09:00", end: "10:00", room: "102" },
      { subject: "Mathematics-II", start: "10:00", end: "11:00", room: "103" },
      { subject: "Physics", start: "11:15", end: "12:15", room: "104" },
      { subject: "English", start: "13:00", end: "14:00", room: "105" },
      { subject: "Workshop", start: "14:15", end: "15:15", room: "106" }
    ]
  },
  {
    roll_no: "25240N",
    name: "HARSHA",
    age: 21,
    class: "ECE - IV Year",
    marks: 85,
    attendance: "90%",
    classroom: "Room 304",
    venue: "Block C",
    timetable: [
      { subject: "Digital Signal Processing", start: "09:00", end: "10:00", room: "301" },
      { subject: "Control Systems", start: "10:00", end: "11:00", room: "302" },
      { subject: "Embedded Systems", start: "11:15", end: "12:15", room: "303" },
      { subject: "VLSI Design", start: "13:00", end: "14:00", room: "304" },
      { subject: "Wireless Communication", start: "14:15", end: "15:15", room: "305" }
    ]
  }
];

// -------------------- Utility: populate datalist --------------------
window.onload = function() {
  populateDatalist();
};

function populateDatalist() {
  const list = document.getElementById("rollList");
  list.innerHTML = "";
  students.forEach(s => {
    const option = document.createElement("option");
    // datalist option.value is displayed when selecting; include both roll and name in label text
    option.value = s.roll_no;
    option.textContent = `${s.roll_no} - ${s.name}`;
    list.appendChild(option);
  });
}

// -------------------- Time helpers --------------------
function currentTimeString() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function timeInRange(time, start, end) {
  // all strings "HH:MM" - simple comparison works
  return time >= start && time <= end;
}

function getCurrentClass(timetable) {
  const t = currentTimeString();
  for (let slot of timetable) {
    if (timeInRange(t, slot.start, slot.end)) return slot;
  }
  return null;
}

// -------------------- Wizard / Step logic --------------------
let activeStudent = null;
let fields = []; // will be array of {key,label,render}

// Build fields for the wizard
function buildFieldsForStudent(s) {
  return [
    { key: "roll_no", label: "Roll Number", render: () => `<div><b>Roll No:</b> ${s.roll_no}</div>` },
    { key: "name", label: "Name", render: () => `<div><b>Name:</b> ${s.name}</div>` },
    { key: "age", label: "Age", render: () => `<div><b>Age:</b> ${s.age}</div>` },
    { key: "class", label: "Class", render: () => `<div><b>Class:</b> ${s.class}</div>` },
    { key: "marks", label: "Marks", render: () => `<div><b>Marks:</b> ${s.marks}%</div>` },
    { key: "attendance", label: "Attendance", render: () => `<div><b>Attendance:</b> ${s.attendance}</div>` },
    { key: "classroom", label: "Classroom", render: () => `<div><b>Classroom:</b> ${s.classroom}</div>` },
    { key: "venue", label: "Venue", render: () => `<div><b>Venue:</b> ${s.venue}</div>` },
    { key: "current", label: "Current Class (by time)", render: () => {
        const cur = getCurrentClass(s.timetable);
        if (cur) {
          return `<div><b>Current Class:</b> ${cur.subject}</div>
                  <div><b>Room No:</b> ${cur.room}</div>
                  <div><b>Time:</b> ${cur.start} - ${cur.end}</div>`;
        }
        return `<div><b>Current Class:</b> No class right now (${currentTimeString()})</div>`;
      }
    },
    { key: "timetable", label: "Full Timetable", render: () => renderTimetable(s.timetable) }
  ];
}

function renderTimetable(timetable) {
  if (!timetable || timetable.length === 0) return "<div>No timetable available.</div>";
  let html = `<table style="width:100%; border-collapse:collapse;">
    <thead><tr>
      <th style="text-align:left; padding:6px">Subject</th>
      <th style="text-align:left; padding:6px">Start</th>
      <th style="text-align:left; padding:6px">End</th>
      <th style="text-align:left; padding:6px">Room</th>
    </tr></thead><tbody>`;
  timetable.forEach(slot => {
    html += `<tr>
      <td style="padding:6px">${slot.subject}</td>
      <td style="padding:6px">${slot.start}</td>
      <td style="padding:6px">${slot.end}</td>
      <td style="padding:6px">${slot.room}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  return html;
}

let currentIndex = 0;

function selectStudent() {
  const rollNoInput = document.getElementById("rollNo").value.trim();
  const nf = document.getElementById("notfound");
  nf.textContent = "";
  const s = students.find(x => x.roll_no.toLowerCase() === rollNoInput.toLowerCase());
  if (!s) {
    nf.textContent = "Please select a valid roll number from the list.";
    document.getElementById("wizard").style.display = "none";
    document.getElementById("result").style.display = "none";
    activeStudent = null;
    return;
  }
  activeStudent = s;
  fields = buildFieldsForStudent(s);
  currentIndex = 0;
  buildFieldListUI();
  showField(currentIndex);
  document.getElementById("wizard").style.display = "block";
  document.getElementById("result").style.display = "none";
}

function buildFieldListUI() {
  const list = document.getElementById("fieldList");
  list.innerHTML = "";
  fields.forEach((f, idx) => {
    const div = document.createElement("div");
    div.className = "field-item";
    div.id = `field-item-${idx}`;
    div.innerHTML = `${idx+1}. ${f.label}`;
    div.onclick = () => { showField(idx); };
    list.appendChild(div);
  });
}

function showField(idx) {
  if (!fields || idx < 0 || idx >= fields.length) return;
  currentIndex = idx;
  // highlight active in list
  fields.forEach((_, i) => {
    const el = document.getElementById(`field-item-${i}`);
    if (el) el.classList.toggle("active", i === idx);
  });
  // render
  const card = document.getElementById("stepCard");
  card.innerHTML = `<h3>${fields[idx].label}</h3>` + fields[idx].render();
  // update nav buttons
  document.getElementById("prevBtn").disabled = (idx === 0);
  document.getElementById("nextBtn").disabled = (idx === fields.length - 1);
}

function nextField() {
  if (currentIndex < fields.length - 1) {
    showField(currentIndex + 1);
  }
}

function prevField() {
  if (currentIndex > 0) {
    showField(currentIndex - 1);
  }
}

function showFullTimetable() {
  // jump to timetable field (last field)
  const idx = fields.findIndex(f => f.key === "timetable");
  if (idx >= 0) showField(idx);
}

function clearView() {
  document.getElementById("rollNo").value = "";
  document.getElementById("notfound").textContent = "";
  document.getElementById("wizard").style.display = "none";
  document.getElementById("result").style.display = "none";
  activeStudent = null;
  fields = [];
}

// Optional: keep current-class updated while wizard is open
setInterval(() => {
  if (!activeStudent) return;
  // if currently showing 'current' field, refresh it so the time result is live
  const field = fields[currentIndex];
  if (field && field.key === "current") showField(currentIndex);
}, 30_000); // refresh every 30 seconds
