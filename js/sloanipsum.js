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

	// Known broken stuff:
	// looping strings split at apostrophe is failing (undefined or repeated strings)
	// some lines with commas are breaking the line that follows (probably because of spaces)

	// TODO:
	// convert checks to regexes, lazybones
	// Clean up uncapitalize for special cases (make array or something)
	// Handle special uncapitalize cases for 'S E A N', 'P L A Y', 'Jolene'
	// Check data for more split quotations

	for(var p = 0; p < numberOfParagraphs; p++) {
		// we want all the paragraphs to be different lengths
		var paragraphLength = generateParagraphLength();

		for(var i = 0; i < paragraphLength; i++) {
			var ipsumLine = lyrics[Math.floor(Math.random()*lyrics.length)];

			// uncapitalize line if chained together with commas
			if(ipsumText.trim().slice(-1) == ',') {
				if(ipsumLine.slice(0,2) != 'I ' && ipsumLine.slice(0,2) != "I'" && ipsumLine.slice(0,6) != 'Johnny' && ipsumLine.slice(0,4) != 'Sean' && ipsumLine.slice(0,3) != 'Ana') {
					ipsumLine = uncapitalize(ipsumLine);
				}

				// catch leading apostrophes and parentheticals, uncapitalize second char there instead
				// YES this is redundant and ugly. TODO: fix once strings are all coming back ok
				if(ipsumLine.slice(0,1) == '(' || ipsumLine.slice(0,1) == "'") {
					if(ipsumLine.slice(0,1) == '(' && (ipsumLine.slice(1,3) != 'I ' && ipsumLine.slice(1,3) != "I'")) {
						var newLine = ipsumLine.split('(');
						newLine[1] = uncapitalize(newLine[1]);
						ipsumLine = '(' + newLine[1];
					}
					else if(ipsumLine.slice(0,1) == "'") {
						var newLine = ipsumLine.split("'");
						newLine[1] = uncapitalize(newLine[1]);
						console.log(newLine)
						ipsumLine = "'";

						for(var j = 1; j <= newLine.length; j++) {
							ipsumLine += newLine[i]

						}
					}
				}
			}

			// randomly decide whether to string into longer sentence
			// I hate regex
			var lastChar = ipsumLine.slice(-1);
			var lastCharPunctuation = (lastChar != '.' && lastChar != '?' && lastChar != ',' && lastChar != '!');

			if(randBoolean() && i < paragraphLength-1 && chainedLines < 4) {
				if(lastCharPunctuation){
					// console.log('fulfilled if statements, comma added to (before):',ipsumLine)
					ipsumLine += ', ';
				}
				else {
					// console.log('no if conditions, comma added to (before):',ipsumLine)
					ipsumLine = ipsumLine.slice(0, -1) + ', ';
				}
				chainedLines++;
			}
			else {
				if(lastCharPunctuation){
					// console.log('if conditions, period added to:',ipsumLine);
					ipsumLine += '. ';
				}
				else {
					// console.log('fires if there is a period or question mark... that happened!')
					ipsumLine += ' ';
				}
				chainedLines = 0;
			}

			ipsumText += ipsumLine;
		}
		if(p < numberOfParagraphs) {
			ipsumText += '</p><p>';
		}
		else {
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