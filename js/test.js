main();

function main() {
	var buildSuffixArray = function(input, n) {
		var suffixes = new Array(n);
		for (var i = 0; i < n; i++) {
			suffixes[i] = new Suffix();
			//console.log(suffixes[i]);
			suffixes[i].index = i;
			suffixes[i].rank[0] = input.charCodeAt(i) - 'a'.charCodeAt(0);
			//console.log(input.charCodeAt(i) - 'a'.charCodeAt(0));
			suffixes[i].rank[1] = ((i + 1) < n) ? (input.charCodeAt(i + 1) - 'a'.charCodeAt(0)) : -1;
			//console.log(suffixes[i]);
		}
		
		suffixes.sort(Suffix.compare);
		var ind = new Array(n);
		for (var k = 4; k < 2 * n; k = k * 2) {
			var rank = 0;
			var prev_rank = suffixes[0].rank[0];
			suffixes[0].rank[0] = rank;
			ind[suffixes[0].index] = 0;

			for (var i = 1; i < n; i++) {
				if (suffixes[i].rank[0] == prev_rank &&
						suffixes[i].rank[1] == suffixes[i - 1].rank[1]) {
					prev_rank = suffixes[i].rank[0];
					suffixes[i].rank[0] = rank;
				} else {
					prev_rank = suffixes[i].rank[0];
					suffixes[i].rank[0] = ++rank;
				}
				ind[suffixes[i].index] = i;
			}

			for (var i = 0; i < n; i++) {
				var nextIndex = suffixes[i].index + k / 2;
				//console.log(ind[nextIndex]);
				//console.log(i);
				suffixes[i].rank[1] = (nextIndex < n) ? suffixes[ind[nextIndex]].rank[0] : -1;
			}
			suffixes.sort(Suffix.compare);
		}
		//console.log(suffixes);
		var suffixArray = new Array(n);
		for (var i = 0; i < n; i++) {
			suffixArray[i] = suffixes[i].index;
		}
		console.log(suffixArray);
		return suffixArray;
	};
	var str = "banana";
	//buildSuffixArray(str, str.length);
	function sortArray() {
		var ar = new Array(6);
		for (var i = 0; i < 6; i++) {
			ar[i] = new Suffix();
		}
		ar[0].rank[0] = 2;
		ar[0].rank[1] = 3;
		ar[1].rank[0] = 1;
		ar[1].rank[1] = 0;
		ar[2].rank[0] = 0;
		ar[2].rank[1] = -1;
		ar[3].rank[0] = 3;
		ar[3].rank[1] = 3;
		ar[4].rank[0] = 3;
		ar[4].rank[1] = -1;
		ar[5].rank[0] = 1;
		ar[5].rank[1] = 1;
		ar.sort(function(a, b) {
	if (a.rank[0] === b.rank[0]) {
		if (a.rank[1] < b.rank[1]) {
			return -1;
		} else if (a.rank[1] > b.rank[1]) {
			return 1;
		}
	} else {
		if (a.rank[0] < a.rank[0]) {
			console.log(a, b);
			return -1;
		} else if (a.rank[0] > a.rank[0]) {
			console.log(a, b);
			return 1;
		}
	}
	console.log(a, b);
	return 0;
});
		//console.log(ar);
		
	}
	sortArray();

}

function Suffix() {
	this.index;
	this.rank = new Array(2);
}

Suffix.compare = function(a, b) {
	if (a.rank[0] == b.rank[0]) {
		if (a.rank[1] < b.rank[1]) {
			return -1;
		} else if (a.rank[1] > b.rank[1]) {
			return 1;
		}
	} else {
		if (a.rank[0] < a.rank[0]) {
			return -1;
		} else if (a.rank[0] > a.rank[0]) {
			return 1;
		}
	}
	return 0;
}


