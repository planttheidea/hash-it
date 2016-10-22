# hashIt CHANGELOG

#### 2.0.1
* More speed improvements

#### 2.0.0
* Use JSON.stringify with replacer as default, without try/catch
* Move use of try/catch with fallback to prune to new `hashIt.withRecursion` method (only necessary for deeply-recursive objects like `window`)
* Reorder switch statement for commonality of use cases
* Leverage typeof in switch statements when possible for performance

#### 1.3.1
* Add optimize-js plugin for performance in script version

#### 1.3.0
* Add hashIt.isUndefined, hashIt.isNull, and hashIt.isEmpty methods
* Reorder switch statements in replacer and getValueForStringification to reflect most likely to least likely (improves performance a touch)
* Remove "Number" from number stringification
* Leverage prependTypeToString whereever possible
* Include Arguments object class

#### 1.2.1
* Calculation of Math hashCode now uses properties
* Fix README

#### 1.2.0
* Add hashIt.isEqual method to test for equality
* Prepend all values not string or number with object class name to help avoid collision with equivalent string values

#### 1.1.0
* Add support for a variety of more object types
* Fix replacer not using same stringifier for int arrays

#### 1.0.0
* Initial release