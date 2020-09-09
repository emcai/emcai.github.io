// $( document ).ready(function() {
//     $('#results-table').hide();
// });

function setupBrackets() {
	var loops = 1000;

	var p1 = { power: 1, placing: -1 };
	var p2 = { power: 2, placing: -1 };
	var p3 = { power: 3, placing: -1 };
	var p4 = { power: 4, placing: -1 };
	var p5 = { power: 5, placing: -1 };
	var p6 = { power: 6, placing: -1 };
	var p7 = { power: 7, placing: -1 };
	var p8 = { power: 8, placing: -1 };

	var seeding = [];
	seeding.push(p1, p2, p3, p4, p5, p6, p7, p8);

	var placings = [];
	for (var i = 0; i < 8; i++) {
		var placingList = { 1: 0, 2: 0, 3: 0, 4 : 0, 5: 0, 7: 0 };
		placings.push(placingList);
	}

	for (var j = 0; j < loops; j++) {
		playBracket(seeding);
		for (var i = 0; i < 8; i++) {
			var player = seeding[i];
			var playerPlacing = placings[player["power"] - 1];
			playerPlacing[player["placing"]] += 1;
		}
	}
	
	console.log(placings);
	displayTable(placings);
}

function playBracket(seeding) {
	var bracket = { 1: [seeding[0], seeding[1]], 2: [seeding[2], seeding[3]], 
		3: [seeding[4], seeding[5]], 4: [seeding[6], seeding[7]], 5: [], 6: [],
		7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [] };

	for (var i = 1; i <= 15; i++) {
		if (i != 7 && i <= 12) {
			playSet(bracket[i][0], bracket[i][1], i, 2, bracket);
		} else if (i != 15) {
			playSet(bracket[i][0], bracket[i][1], i, 3, bracket);
		} else if (bracket[15].length > 0) {
			playSet(bracket[i][0], bracket[i][1], i, 3, bracket);
		}
	}
}

var double = true; // True if double elimination
// id is the bracket match location
//toWin is number of games needed to win the set
function playSet(p1, p2, id, toWin, bracket) {
	var p1Wins = 0;
	var p2Wins = 0;
	while ((p1Wins < toWin) && (p2Wins < toWin)) {
		if (playGame(p1, p2)) {
			p1Wins += 1;
		} else {
			p2Wins += 1;
		}
	}
	var winner = (p1Wins === toWin) ? p1 : p2;
	var loser = (p1Wins === toWin) ? p2 : p1;

	if (id <= 4) { //Winners R1
		if (id === 1 || id === 2) {
			bracket[5].push(winner);
			if (double) {
				bracket[8].push(loser);
			} else {
				loser.placing = 5;
			}
		} else {
			bracket[6].push(winner);
			if (double) {
				bracket[9].push(loser);
			} else {
				loser.placing = 5;
			}
		}
	} else if (id <= 6) { //Winners Semis
		winner.placing = 0;
		bracket[7].push(winner);
		if (id === 5) {
			if (double) {
				bracket[11].push(loser)
			} else {
				loser.placing = 3;
			}
		} else {
			if (double) {
				bracket[10].push(loser)
			} else {
				loser.placing = 3;
			}
		}
	} else if (id == 7) { //Winners Finals
		if (double) {
			bracket[14].push(winner);
			bracket[13].push(loser);
		} else {
			winner.placing = 1;
			loser.placing = 2;
		}
	} else if (id <= 9) { //Losers R1
		loser.placing = 7;
		if (id === 8) {
			bracket[10].push(winner);
		} else {
			bracket[11].push(winner);
		}
	} else if (id <= 11) { //Losers Quarters
		loser.placing = 5;
		bracket[12].push(winner);
	} else if (id === 12) { //Losers Semis
		loser.placing = 4;
		bracket[13].push(winner);
	} else if (id === 13) { //Losers Finals
		loser.placing = 3;
		winner.placing = 0; //Mark that this player came from Losers bracket
		bracket[14].push(winner);
	} else if (id === 14) { //Grands Set 1
		if (loser.placing === 0) { //Tourney is over
			winner.placing = 1;
			loser.placing = 2;
		}
		else {
			bracket[15].push(winner);
			bracket[15].push(loser);
		}
	} else { //Grands Set 2
		winner.placing = 1;
		loser.placing = 2;
	}
}

function playGame(p1, p2) {
	var num = Math.floor(Math.random() * (p1.power + p2.power));
	return (num < p1.power);
}

function displayTable(placings) {
	for (var i = 0; i < 8; i++) {
		var idName = '#player-' + (i + 1).toString();
		$(idName).not(':first').remove();
		var td = '</td><td>';
		var htmlString = '<td>' + (placings[7 - i][1]) + td
			+ (placings[7 - i][2]) + td + (placings[7 - i][3]) + td
			+ (placings[7 - i][4]) + td + (placings[7 - i][5]) + td 
			+ (placings[7 - i][7]) + '</td>';
		$(idName).append(htmlString);
	}
}