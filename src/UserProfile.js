var UserProfile = (function() {
  var username = sessionStorage.getItem('CurrentUser');
  var privileges = sessionStorage.getItem('Privileges');
  var userID = sessionStorage.getItem('UserID');
  var credits = sessionStorage.getItem('Credits') || 0;
  var fullName = sessionStorage.getItem('FullName');

  var getName = function() {
    return username;
  };

  var setName = function(name) {
    username = name;
    sessionStorage.setItem('CurrentUser', username);
  };

  var getFullName = function() {
    return fullName;
  };

  var setFullName = function(name) {
    fullName = name;
    sessionStorage.setItem('FullName', fullName);
  };

  var getPrivileges = function() {
    return privileges;
  };

  var setPrivileges = function(privilege) {
    privileges = privilege;
    sessionStorage.setItem('Privileges', privileges);
  };

  var getUserID = function() {
    return userID;
  };

  var setUserID = function(user) {
    userID = user;
    sessionStorage.setItem('UserID', userID);
  };

  var getCredits = function() {
    return credits;
  };

  var setCredits = function(credit) {
    credits = credit;
    sessionStorage.setItem('Credits', credits);
  };

  var logOut = function() {
    username = null;
    privileges = null;
    userID = null;
    credits = null;
    fullName = null;
    
    sessionStorage.removeItem('CurrentUser');
    sessionStorage.removeItem('Privileges');
    sessionStorage.removeItem('UserID');
    sessionStorage.removeItem('Credits');
    sessionStorage.removeItem('FullName');
  };

  return {
    getName, setName,
    getPrivileges, setPrivileges,
    getUserID, setUserID,
    setCredits, getCredits, 
    setFullName, getFullName,
    logOut
  }

})();

export default UserProfile;