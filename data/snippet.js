
	> (new Date()).toISOString()
	"2012-05-08T19:20:37.367Z" 
	> (new Date()).toString()
	"Tue May 08 2012 21:20:45 GMT+0200 (CEST)"

	> " 	Too many whitespaces in this string   ".trim()
	"Too many whitespaces in this string"

	>

	var User = function (firstname, lastname) {
		this.firstname = firstname;
		this.lastname = lastname;
	};

	Object.defineProperty(User.prototype, "name", {
		get : function () {
			return this.firstname + " " + this.lastname;
		},
		set : function (value) {
			this.firstname = value.split(" ")[0];
			this.lastname = value.split(" ")[1];
		}
	});

	"use strict";
	var myArray = [];
	for (i = 0 ; i < myArray.length; i++) {
		/*DO STUFF*/
	}
	// BOOM ! ReferenceError: assignment to undeclared variable i

	"use strict";
	var obj = {
        myProp : 1,
        myProp : 2
    }
	// BOOM ! SyntaxError: property name myProp appears more than once in object literal

	Object.defineProperty(A.prototype, "prop", {
		value : 'myProp',
		writable : false,
		enumerable : false,
		configurable : true
	});

	var a = new A;
	a.prop = 42;

	a.prop;
	// "myProp"

	Object.keys(a);
	// nothing

	Object.getOwnPropertyDescriptor(a, 'prop');
	// nothing

	Object.getOwnPropertyDescriptor(A.prototype, 'prop');
	// Object { configurable=true, enumerable=false, value="myProp", writable=false}

	// You can use it to update already existing properties
	Object.defineProperty(A.prototype, "prop", {
		writable : true
	});

	Object.getOwnPropertyDescriptor(A.prototype, 'prop');
	// Object { configurable=true, enumerable=false, value="myProp", writable=true}

	a.prop = 42;
	a.prop;
	// 42

	Object.getOwnPropertyDescriptor(a, 'prop');
	// Object { configurable=true, enumerable=true, value="myProp", writable=true}

	>

	var obj = {};
	
	obj.oldProp = "Wazzup!";

	Object.defineProperty(obj, "newProp", {
		value : 'some value',
		writable : false,
		enumerable : false,
		configurable : true
	});

	obj.newProp = 42; // error in strict mode !

	obj.newProp;
	// "some value"

	Object.keys(obj);
	// ["oldProp"]

	Object.getOwnPropertyDescriptor(obj, 'newProp');
	// Object { configurable=true, enumerable=false, value="some value", writable=false}
	Object.getOwnPropertyDescriptor(obj, 'oldProp');
	// Object { configurable=true, enumerable=true, value="Wazzup!", writable=true}

	// You can update already existing properties
	Object.defineProperty(obj, 'newProp', {
		writable : true
	});

	obj.newProp = 42;



