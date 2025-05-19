// badges.js

function getBadges() {
  const mins = (parseFloat(localStorage.getItem("listenTime")||"0")) / 60;
  const list = [];
  if (mins >= 10)  list.push("🦉 Night Owl (10m+)");  
  if (mins >= 30)  list.push("🐆 Cheetah Sprint (30m+)");
  if (mins >= 60)  list.push("🐘 Elephant Memory (60m+)");
  if (mins >= 120) list.push("🦁 Lionheart (2h+)");
  return list;
}

function showBadges() {
  const b = getBadges();
  if (!b.length) {
    alert("No badges yet. Keep listening!");
  } else {
    alert("Your Badges:\\n" + b.join("\\n"));
  }
}
