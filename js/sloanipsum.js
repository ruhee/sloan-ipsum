function getNumber() {
	var numberOfParagraphs = parseInt(document.getElementById('numparagraphs').value);
	if(!numberOfParagraphs) {
		numberOfParagraphs = 1;
	}
	generateIpsum(numberOfParagraphs);
}

function generateIpsum(numberOfParagraphs) {

	var ipsumText = '<p>';
	var chainedLines = 0;

	// TODO: Force it not to end a 'sentence' if the phrase ends with 'and'?
	// MAYBE TODO: Enable album selection/exclusion??? (This seems crazy.)

	for(var p = 0; p < numberOfParagraphs; p++) {
		// we want all the paragraphs to be different lengths
		var paragraphLength = generateParagraphLength();

		for(var i = 0; i < paragraphLength; i++) {
			var ipsumLine = lyrics[Math.floor(Math.random()*lyrics.length)];

			// uncapitalize line if chained together with commas
			// and if also not one of the million special cases (G turns to D, S E A N S A I D, etc.)
			if(ipsumText.trim().slice(-1) == ',') {
				if(ipsumLine.slice(0,2) != 'I ' && ipsumLine.slice(0,2) != "I'" && // lol
					ipsumLine.slice(0,6) != 'Johnny' &&
					ipsumLine.slice(0,4) != 'Sean' &&
					ipsumLine.slice(0,3) != 'Ana' &&
					ipsumLine.slice(0,6) != 'Jolene' &&
					ipsumLine.slice(0,7) != 'Chester' &&
					ipsumLine.slice(0,2) != 'S ' &&
					ipsumLine.slice(0,2) != 'P ' &&
					ipsumLine.slice(0,2) != 'G ' &&
					ipsumLine.slice(0,9) != 'Halloween') {

						ipsumLine = uncapitalize(ipsumLine);
				}

				// catch leading apostrophes, uncapitalize second char there instead
				if(ipsumLine.slice(0,1) == "'") {
					ipsumLine = uncapitalize(ipsumLine.slice(1));
					ipsumLine = "'" + ipsumLine;
				}
			}

			// randomly decide whether to string into longer sentence
			// I hate regex
			var lastChar = ipsumLine.slice(-1);
			var lastCharNotPunctuation = (lastChar != '.' && lastChar != '?' && lastChar != ',' && lastChar != '!');

			// random function returns true + not the last line + not a million chained phrases
			if(randBoolean() && i < paragraphLength-1 && chainedLines < 4) {
				if(lastCharNotPunctuation){
					ipsumLine += ', ';
				}
				else {
					// last char IS punctuation, so slice it off and add a comma instead
					ipsumLine = ipsumLine.slice(0, -1) + ', ';
				}
				chainedLines++;
			}
			else {
				if(lastCharNotPunctuation){
					ipsumLine += '. ';
				}
				else {
					// last char IS punctuation, just leave it there since we're starting a new 'sentence'
					ipsumLine += ' ';
				}
				chainedLines = 0;
			}

			ipsumText += ipsumLine;
		}

		// if this isn't the last paragraph, make a new one
		if(p < numberOfParagraphs) {
			ipsumText += '</p><p>';
		}
		else {
			// check for punctuation here too, slice and add a period if a comma
			ipsumText += '</p>';
		}
	}// end for (numberOfParagraphs)

	var ipsumContainer = document.getElementById('ipsum-container');
	ipsumContainer.innerHTML = ipsumText;
}

function generateParagraphLength() {
	return Math.floor(Math.random() * 8 + 8);
}

// just randomly return true or false, mostly for punctuation adding
function randBoolean() {
	return !!Math.floor(Math.random() * 2);
}

function uncapitalize(str) {
	return str.substr(0,1).toLowerCase() + str.substr(1);
}