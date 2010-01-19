function successTest (numberOfDice, targetNumber) {
	var diceCup = new DiceCup(6);
	var set = diceCup.cumulativeRoll(numberOfDice, 6);

	if (set.size() == set.count(1)) {
		throw new RuleOfOneException("CHARACTER");
	}

	return set.asArray().filter( (new GreaterOrEqualTargetNumberFilter(10).apply)).length;
}

function successContest (characterRating, characterDefense, opponentRating, opponentDefense) {
	
	var characterSucesses = 0;
	var opponentSuccesses = 0;
	
	try {
		characterSucesses = successTest(characterRating, opponentDefense);
	} catch (e) {
		throw new RuleOfOneException("CHARACTER");
	}
	
	try {
		opponentSuccesses = successTest(opponentRating, characterDefense);
	} catch (e) {
		throw new RuleOfOneException("OPPONENT");
	}
	
	return characterSucesses - opponentSuccesses;
}

function openTest (numberOfDice) {
	var diceCup = new DiceCup(6);
	var set = diceCup.cumulativeRoll(numberOfDice, 6);
	
	return Array.max(set.asArray());
}

function opposedTest(valueOfCharacter, valueOfOpponent) {
	var characterSucesses = 0;
	var opponentSuccesses = 0;
	
	try {
		characterSucesses = successTest(valueOfCharacter, valueOfOpponent);
	} catch (e) {
		throw new RuleOfOneException("CHARACTER");
	}
	
	try {
		opponentSuccesses = successTest(valueOfOpponent, valueOfCharacter);
	} catch (e) {
		throw new RuleOfOneException("OPPONENT");
	}

	return characterSucesses - opponentSuccesses;
	
}

function RuleOfOneException (party) {
	this.party = party;
}

function GreaterOrEqualTargetNumberFilter (targetNumber) {
	this.apply = function (x) {
		return x >= targetNumber;
	}	
}

/***************************
 * Prototyping
 ***************************/

Array.max = function( array ) {
    return Math.max.apply( Math, array );
};


/***************************
 * Classes
 ***************************/

function Multiset() {

	var collection = new Object();

	this.add = function (key) {
		if (!this.exists(key)) {
			collection[key] = 1;
		} else {
			collection[key] = collection[key] + 1;
		}
	}

	this.exists = function (key) {
		return collection[key] != null;
	}	

	this.toString = function () {
		var string = "";
		for (property in collection) {
			if (collection.hasOwnProperty(property)) {
				string += collection[property] + "x " + property + ", ";
			}
		}	
		return string;
	}

	this.count = function (element) {
		if (this.exists(element)) {
			return collection[element];
		}
		return 0;
	}

	this.setCount = function (element, count) {
			collection[element] = count;
	}

	this.removeElement = function (element) {
		if (this.exists(element)) {
			delete collection[element];
		}
	}

	this.collection = function () {
		return collection;
	}

	this.addAll = function (multiset) {
		var c = multiset.collection();
		for (property in c) {
			if (c.hasOwnProperty(property)) {
				this.setCount(property, parseInt(multiset.count(property)) + parseInt(this.count(property)));
			}
		}
	}

	this.size = function () {
		var size = 0;
		for (property in collection) {
			if (collection.hasOwnProperty(property)) {
				size += this.count(property);
			}
		}
		return size;
	}

	this.asArray = function () {
		var myArray = [];

		for (property in collection) {
			if (collection.hasOwnProperty(property)) {
				var count = this.count(property);
				for (var i = 0; i < count; i++) {
					myArray.push(property);
				}
			}
		}
		return myArray;
	}
}

function DiceCup (numberOfSides) {
	
	this.roll = function (numberOfDice) {
		var s = new Multiset();
		var roll;
		for (i=0; i < numberOfDice; i++) {
			roll = Math.round(Math.random() * numberOfSides) % numberOfSides + 1;
			s.add(roll);
		}
		return s;
	}
	
	this.cumulativeRoll = function (numberOfDice, rerollAt) {
		var c = this.roll(numberOfDice);
		var cumulativeRerollAt = rerollAt;
		var numberOfDiceToReroll;
		while (c.count(cumulativeRerollAt) > 0) {
			numberOfDiceToReroll = c.count(cumulativeRerollAt);
			c.removeElement(cumulativeRerollAt);
			var reroll = this.roll(numberOfDiceToReroll);
			c.addAll(this.transform (reroll, cumulativeRerollAt));
			cumulativeRerollAt += rerollAt;
		}
		return c;
	}

	this.transform = function (set, cumulativeRerollAt) {
		var c = set.collection();
		for (property in c) {
			if (c.hasOwnProperty(property)) {
				set.setCount(parseInt(property) + parseInt(cumulativeRerollAt), c[property]);
				set.removeElement(property);
			}
		}
		return set;
	}
}










