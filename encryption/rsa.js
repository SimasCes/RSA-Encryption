// this computes x to the power of y modulo z - we need a special function for this for very large numbers: do NOT use (x ** y) % z
// it takes three numbers as inputs and returns a number
function modulo(x, y, z) {
	r = 1;
	while (y > 0) {
		if (y % 2 == 1) {
			r = (r * x) % z;}
		y = Math.floor(y / 2); 
		x = (x * x) % z;
	}
	return r;
}

// this will return the totient function of inputs p and q
// it takes two numbers as inputs and returns a number
function totient(p,q) {
	if ((p <= 1) || (q <= 1)) {
		return "Inputs need to be larger!";
	}

	return ((p - 1) * (q - 1))*(1/gCD(p - 1, q -1));
}

// this will return a random exponent used for encryption from a number n
// it takes a number as input and returns a number
function genExp(n) {
	function isPrime(n) {
		if (n < 2) {
			return false;
		}
		for (var i = 2; i <= Math.round(Math.sqrt(n)); i++) {
			if (n % i == 0) {
				return false;
			}
		}
		return true;
	}
	var stop = false; 
	while (!stop) {
		var num = 2 + Math.round((n-3)*Math.random());
		if (isPrime(num) && (gCD(n,num) == 1)) {
			return num;
		}
	}
}

// this computes the modular multiplicative inverse of a mod m, used in generating the private key
// it takes two numbers as inputs and returns a number
function genInverse(a,m) {
	var b = m;
   	var x = 0;
   	var y = 1;
   	var u = 1;
   	var v = 0;

   	while (a !== 0) {
   		var q = Math.floor(m / a);
   		var r = m % a;
   		var p = x - (u * q);
   		var n = y - (v * q);
   		m = a;
   		a = r;
   		x = u;
   		y = v;
   		u = p;
   		v = n;
   	}

 	var out = [m, x, y];
 	if (out[1] < 0) {
 		out[1] = b + out[1];
 	}
 	return out[1];
}




////////////////////////
////////////////////////
// The following will generate a public key and a private key from the random generation of prime numbers

// ADD ANY OTHER NECESSARY FUNCTIONS HERE

//Checks if a number is prime
function isPrime(n) 
{
	//this should return a Boolean

	if(n < 2) 
	{
		return false + ' :the number is too small !';
	} 

	for(var i = 2; i <= Math.sqrt(n); i++)
	{
		if(n % i == 0)
		{
			return false;
		}
	}

	return true;
}

//generates a prime number, len being the size of the number, so if len is 2, it oculd generate 97
function genPrime(len) 
{
	//this should return a number
	if(len < 0)
	{
		return false + ' :input cannot be smaller or equal to 0';
	}


	for(var i = 0; i < Math.pow(10, len); i++)
	{
		var x = Math.round(Math.random() * Math.pow(10, len) + Math.pow(10, len - 1));

		if(isPrime(x) && x < Math.pow(10, len))
		{
			return x;
		}
	}	
}


//Takes as input parameter a non-negative number len, and re-turns an array of two elements where each element is a number with len digits
function genPairPrimes(len) 
{
	var array = [];

	for(var i = 0; i < 2; i++)
	{
		array.push(genPrime(len));
	}

	return array;
}


//Returns a number, which is the greatest common divisor of two numbers, a and b
function gCD(a,b) 
{
	while(a != b)
	{
		if(a > b)
		{
			a = a - b
		}

		if(a < b)
		{
			b = b - a
		}
	}

	return a
}


//Returns an array of two elements, where the first element is the product of the primes (prime1 and prime2) and the second element is what's returned by genExp for particular inputs
function genPublicKey(prime1,prime2) 
{
	var array = []; 

	array.push(prime1 * prime2);

	array.push(genExp(totient(prime1, prime2)));

	return array;
}

//Returns an array of two elements, where the first element is the product of the primes (prime1 and prime2) and the second element is what's returned by genInverse for particular inputs
function genPrivateKey(product,exponent,totient) 
{
	var array =[];

	array.push(product);

	array.push(genInverse(exponent, totient));

	return array;
}


var table = ["e", "t", "a", "i", "n", "o", "s", "h", "r", , "d", "l", "u", "c", "m", "f", "w", "y", "g", , "p", "b", "v", "k", "q", "j", "x", "z"];

//Returns a number from a string, which will be the word we wish to encode using table
//We will also have 0's inbetween each letter (so hi, becomes 8 0 4)
function encode(string) 
{
	var output = "";

	for(var i = 0; i < string.length; i++) 
	{
		for(var j = 0; j <= table.length; j++) 
		{
			//.charAt chooses only one letter of the string to compare
			if(string.charAt(i) == table[j]) 
			{
				output = output + (j + 1) + 0; 
			}
		}
	}

	//This makes the output change from a string to an integer
	// divide by 10 is used to remove the ending 0
	var integerOutput = parseInt(output) / 10

	return integerOutput;
}

//Produces a new encrypted number using the publicKey
function encrypt(number, publicKey) 
{
	var n = publicKey[0];

	var e = publicKey[1];

	var c = modulo(number, e, n);

	return c;
}

// The following decrypts messages
//Returns a number from the input parameters message and privateKey
function decrypt(message,privateKey) 
{
	var n = privateKey[0];

	var v = privateKey[1];	

	var p = modulo(message, v, n);

	return p;
}
 
//Converts numbers into words
function convertToText(number) 
{
	// when completed this will return a string which is the initial word encoded above
	var string = number.toString();
	var n = string.length;
	var i = 0;
	var word = "";
	while (i < n) 
	{
		var num = "";
		while(string.charAt(i) != 0) 
		{
			num = num + string.charAt(i);
			i++;
		}

		num = parseInt(num);
		word = word + table[num - 1];
		i++;
	}

	return word;
}



var primes = genPairPrimes(3);
var publicKey = genPublicKey(primes[0], primes[1]);
var privateKey = genPrivateKey(primes[0] * primes[1], publicKey[1], totient(primes[0], primes[1])); 
// console.log(publicKey);
// console.log(privateKey);



// var word = "hi";
// var message = encode(word); 
// console.log(message); 
// console.log(typeof message);

var word = "hi";
var message = encode(word);
message = encrypt(message , publicKey); 
// console.log(message);


var plain = decrypt(message , privateKey); 
// console.log(plain);


var plain = convertToText(plain);
console.log(plain);


	