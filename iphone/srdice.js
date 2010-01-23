const SIDES = 6;

function successTest (numberOfDice, targetNumber) {
	var diceCup = new DiceCup(SIDES);
	var roll = diceCup.roll(numberOfDice, SIDES);

	var result = new Object();
	var myFilter = new GreaterOrEqualTargetNumberFilter(targetNumber);
	
	result.all = roll;
	result.successes = roll.filter(myFilter.apply)
	result.max = roll[roll.length-1];
	result.sum = Array.sum(roll);
	
	if (roll.length == count(roll, 1)) {
		result.fail = true;
	}

	return result;
}

Array.sum = function(myArray){
	for(var i=0,sum=0;i<myArray.length;sum+=myArray[i++]);
	return sum;
}

function GreaterOrEqualTargetNumberFilter (targetNumber) {
	
	var tn = targetNumber;
	
	this.apply = function (x) {
		return x >= tn;
	}	
}

/**
 * Returns how often an element occurs in an array
 */
function count(myArr, el) {
	var b = {};
	var i = myArr.length;
	var j;
	while( i-- ) {
		j = b[myArr[i]];
		b[myArr[i]] = j ? j+1 : 1;
	}
	return b[el];
}


function DiceCup (numberOfSides) {
	
	this.rollOnce = function (numberOfDice) {
		var cup = new Array();
		var dice;
		for (i=0; i < numberOfDice; i++) {
			dice = Math.round(Math.random() * numberOfSides) % numberOfSides + 1;
			cup.push(dice);
		}
		return cup;
	}
	
	this.roll = function (numberOfDice, rerollAt) {
		var a = this.rollOnce(numberOfDice);
		return this.reroll (a, rerollAt).sort(function(a,b){return a - b});
	}

	this.reroll = function (originalArray, rerollAt) {
		var j = 0;
		while (j < originalArray.length) {
			if (originalArray[j] % rerollAt == 0) {
					originalArray[j] += this.rollOnce(1)[0];
			} else {
				j++;
			}
		}
		return originalArray;
	}
}