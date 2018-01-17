$(document).ready( function() {
	main();
});

function main() {
	var compressor = new Compressor();
	compressor.changeCompressionType();
	compressor.encode();
	compressor.decode();
}

function Compressor() {
	this.result = "";
	this.compressionType = "Run-Length Encoding";
	
	this.changeCompressionType = function() {
		var self = this;
		$('.nav li').on('click', function() {
			$('.nav li').removeClass("active");
			$(this).addClass("active");
			self.compressionType = $(this).text();
			updatePage(self.compressionType);
		});
	};

	
	this.encode = function() {
		var self = this;
		$('#encode-form').on("submit", function(e) {
			e.preventDefault();
			var input = $('#encode-form #encode').val();
			if (self.compressionType === "Run-Length Encoding") {
				self.result = RLEEncode(input);
			} else if (self.compressionType === "Burrows-Wheeler Transform") {
				self.result = BWTEncode(input);
			} else if (self.compressionType === "LZW Compression") {
				self.result = LZWEncode(input);
			}
			$('.well #result').text(self.result);
			$('.well').removeClass("hide");
		});
	};

	this.decode = function() {
		var self = this;
		$('#decode-form').on("submit", function(e) {
			e.preventDefault();
			var input = $('#decode-form #decode').val();
			if (self.compressionType === "Run-Length Encoding") {
				self.result = RLEDecode(input);
			} else if (self.compressionType === "Burrows-Wheeler Transform") {
				self.result = BWTDecode(input);
			} else if (self.compressionType === "LZW Compression") {
				self.result = LZWDecode(input);
			}
			$('.well #result').text(self.result);
			$('.well').removeClass("hide");
		});
	};


	var updatePage = function(compressionType) {
		$('.jumbotron #compressionType').text(compressionType);
		$('.jumbotron p').addClass("hide");
		if (compressionType === "Run-Length Encoding") {
		 	$('.jumbotron #RLEDescription').removeClass("hide");
			
		} else if (compressionType === "Burrows-Wheeler Transform") {
			$('.jumbotron #BWTDescription').removeClass("hide");
		} else if (compressionType === "LZW Compression") {
			$('.jumbotron #LZWDescription').removeClass("hide");
		}
	};

	var RLEEncode = function(input) {
		var result = "";
		var count = 1;
		for (var i = 1; i < input.length; i++) {
			if (input.charAt(i - 1) === input.charAt(i)) {
				count++;
			} else {
				result += count + "" + input.charAt(i - 1);
				count = 1;
			}
		}
		result += count + "" + input.charAt(input.length - 1);
		return result;
	};

	var BWTEncode = function(input) {
		var suffixArray = buildSuffixArray(input, input.length);
		var bw = "";
		for (var i = 0; i < suffixArray.length; i++) {
			if (suffixArray[i] == 0) {
				bw += input.charAt(input.length - 1);
			} else {
				bw += input.charAt(suffixArray[i] - 1);
			}
		}
		return bw;
	};

	var LZWEncode = function(input) {
		return "";
	};

	var RLEDecode = function(input) {
		var result = "";
		count = 0;
		for (var i = 0; i < input.length; i++) {
			count = input.charAt(i);
			i++;
			for (var j = 0; j < count; j++) {
				result += input.charAt(i);
			}
		}
		return result;
	};

	var BWTDecode = function(input) {
		return "";
	};

	var LZWDecode = function(input) {
		return "";
	};

	var buildSuffixArray = function(input, n) {
		var suffixes = new Array(n);
		for (var i = 0; i < n; i++) {
			suffixes[i] = new Suffix();
			//console.log(suffixes[i]);
			suffixes[i].index = i;
			suffixes[i].rank[0] = input.charCodeAt(i) - 'a'.charCodeAt(0);
			console.log(input.charCodeAt(i) - 'a'.charCodeAt(0));
			suffixes[i].rank[1] = ((i + 1) < n) ? (input.charCodeAt(i + 1) - 'a'.charCodeAt(0)) : -1;
			//console.log(suffixes[i]);
		}
		
		suffixes.sort(function(a, b) {
	if (a.rank[0] === b.rank[0]) {
		if (a.rank[1] < b.rank[1]) {
			return -1;
		} else if (a.rank[1] > b.rank[1]) {
			return 1;
		}
	} else {
		if (a.rank[0] < b.rank[0]) {
			return -1;
		} else if (a.rank[0] > b.rank[0]) {
			return 1;
		}
	}
	return 0;
});
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

			suffixes.sort(function(a, b) {
	if (a.rank[0] == b.rank[0]) {
		if (a.rank[1] < b.rank[1]) {
			return -1;
		} else if (a.rank[1] > b.rank[1]) {
			return 1;
		}
	} else {
		if (a.rank[0] < b.rank[0]) {
			return -1;
		} else if (a.rank[0] > b.rank[0]) {
			return 1;
		}
	}
	return 0;
});
		}
		console.log(suffixes);
		var suffixArray = new Array(n);
		for (var i = 0; i < n; i++) {
			suffixArray[i] = suffixes[i].index;
		}
		console.log(suffixArray);
		return suffixArray;
	};

}

function Suffix() {
	this.index;
	this.rank = new Array(2);
}
/*
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
}*/
