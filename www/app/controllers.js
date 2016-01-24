/* global angular, document, window */
'use strict';

angular.module('petBook.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $ionicPopover, $timeout, StorageService, $state, $ionicPopup, $ionicLoading) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    $scope.isWebView = ionic.Platform.isWebView();
    $scope.isIPad = ionic.Platform.isIPad();
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.isWindowsPhone = ionic.Platform.isWindowsPhone();
    $scope.currentPlatform = ionic.Platform.platform();

    console.log('$scope.currentPlatform = ', $scope.currentPlatform);

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons[i].addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.logout = function() {
        /*StorageService.resetCurrentUser();
        $state.go('app.login');*/
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmation',
            template: 'Are you sure you want to log out?',
            okText: '<i class="icon ion-checkmark-round"></i>',
            cancelText: '<i class="icon ion-close-round"></i>',
            okType: 'button-calm'
        });
        confirmPopup.then(function(res) {
            if (res) {
                StorageService.resetCurrentUser();
                $state.go('app.login');
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };
    //for loading screens
    $scope.showLoading = function() {
        $ionicLoading.show({
            template: '<p style="color:#0a9ec7">Loading...</p><ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner>'
        });
    };

    $scope.hideLoading = function() {
        $ionicLoading.hide();
    };
})

.controller('IntroCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.hideNavBar();
    $scope.$parent.hideHeader();
    $scope.$parent.clearFabs();
    //$scope.$parent.setHeaderFab('right');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})




.controller('FriendInfoCtrl', function($scope, $state, $stateParams, ProfileService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    var userID = $stateParams.userID;
    if (userID) {
        var promise = ProfileService.get(userID);
        promise.then(function(data) {
            if (data) {
                $scope.user = data;
            }
        });
    }
})

.controller('EditProfileCtrl', function($scope, $state, $stateParams, ProfileService, StorageService, $ionicLoading, $cordovaCamera, $ionicPlatform, UploadService, notificationService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $scope.user = StorageService.getCurrentUser().user;
    $scope.user.avatar = '';
    $scope.file = {};

    $scope.leftButtons = [{
        type: 'button-positive',
        content: '<i class="icon ion-navicon"></i>',
        tap: function(e) {}
    }];

    $scope.field = $stateParams.field;
    if ($scope.field === 'dob') {
        $scope.value = new Date($stateParams.value);

    } else {
        $scope.value = $stateParams.value;
    }
    $scope.pet = {};


    $scope.pet[$scope.field] = $scope.value;

    // notificationService.showDialog('test, text')
    //     .then(function(success) {
    //         console.log('success is: ', success);
    //     });

    /*console.log('scope.pet is: ', $scope.pet);
    console.log('$scope.field = ', $scope.field);    
    console.log('the value is: ', $scope.value);*/

    $scope.$watch('pet.file', function(newVal){
        if(newVal){
            console.log('file is: ', newVal);
             UploadService.uploadS3(newVal)
            .then(function(result) {
                console.log('result is: ', result);
            }, function(error) {
                console.log('error is: ', error);
            }); //end of uploadS3Data

        }
    })
    $scope.save = function(pet) {
        var user = StorageService.getCurrentUser().user;
        pet._id = user._id;
        pet.photoUrl = $scope.user.avatar || pet.photoUrl;
        var promise = ProfileService.update(pet);
        $scope.showLoading($ionicLoading);
        promise.then(function(response) {
                if (response) {
                    $state.go('app.profile', {
                        field: $scope.field,
                        value: pet[$scope.field]
                    });
                }
            })
            .finally(function($ionicLoading) {
                //hide the loading
                $scope.hideLoading($ionicLoading);
            });

    }

    $scope.cancel = function() {
        $scope.pet = {};
        $scope.user.avatar = '';
        $state.go('app.profile');
    }


    //upload selected avatar image to AWS; not finished yet
    $scope.upload = function() {

        UploadService.uploadS3Data($scope.user.avatar)
            .then(function(result) {
                console.log('result is: ', result);
                notificationService.showDialog(result)
                    .then(function(res) {
                        console.log('dialog completed');
                    });
            }, function(error) {
                console.log('error is: ', error);
                notificationService.showDialog(error)
                    .then(function(res) {
                        console.log('dialog completed');
                    });
            }); //end of upload

    }

    $scope.uploadFile = function() {
        var fileChooser = document.getElementById('file-chooser');
        // angular.element('#file-chooser');

        console.log('fileChooser.files[0] = ', fileChooser.files[0]);
        var fileTest = fileChooser.files[0];
        $scope.fileTest = fileTest;
        // if (fileTest) {
        //     // results.innerHTML = '';

        //     console.log('fileTest is: ', fileTest);
        //     UploadService.uploadS3Data(fileTest)
        //     .then(function(result) {
        //         console.log('result is: ', result);
        //     }, function(error) {
        //         console.log('error is: ', error);
        //     }); //end of uploadS3Data

        // } else {
        //     // results.innerHTML = 'Nothing to upload.';
        //     alert('error has occured');
        // }
        //console.log('in edit profile ctrl');
    }

    //choose a photo for avatar; the avatar's uri is in $scope.user.avatar

    $scope.selectPhoto = function() {
        document.addEventListener("deviceready", function() {
            console.log('device ready');
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            };
            $cordovaCamera.getPicture(options)
                .then(function(imageData) {
                    $scope.user.avatar = imageData;


                    UploadService.uploadS3Data('data:image/jpeg;base64,' + imageData)
                        .then(uploadSuccess, uploadError)
                        .catch(uploadError);
                    // $scope.user.blob = imageData;
                }); //end getPictures

        });
    } //end selectPhoto

    //  destinationType: Camera.DestinationType.DATA_URL, // this needs to be DATA_URL 
    // sourceType: Camera.PictureSourceType.PHOTOLIBRARY /


    $scope.takePhoto = function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(options)
                .then(function(imageData) {
                    $scope.user.avatar = imageData;
                });
        } //end takePhoto

    function uploadSuccess(result) {
        console.log('result is: ', result);
        $scope.user.avatar = result.Location;
        notificationService.showDialog('upload success', angular.toJson(result))
            .then(function(res) {
                console.log('dialog completed');
            });
    }

    function uploadError(error) {
        console.log('error is: ', error);
        notificationService.showDialog('upload error', angular.toJson(error))
            .then(function(res) {
                console.log('dialog completed');
            });
    }
})


/*.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})*/

.controller('AddPostsCtrl', function($scope, $state) { //, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, StorageService, $ionicPopup, StatusService, LocationService) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.showPopup = function() {
        $state.go('app.newpost');
    }

})

.controller('NewPostCtrl', function($scope, StorageService, StatusService, $state, LocationService, $ionicPopup, $ionicLoading) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $scope.data = {};
        $scope.user = StorageService.getCurrentUser().user;

        $scope.choiceList = [{
            text: "playmates!",
            value: "playmates!"
        }, {
            text: "medical advice.",
            value: "medical advice."
        }, {
            text: "to take a shower.",
            value: "to take a shower."
        }, {
            text: "a walk.",
            value: "a walk."
        }, {
            text: "dog sitting/boarding.",
            value: "dog sitting/boarding."
        }, {
            text: "other:",
            value: "other"
        }];

        LocationService.getCurrentLocation().then(function(loc) {
            $scope.location = loc;
            console.log('location is: ', loc);
        });

        $scope.addPost = function() {
            $scope.data.userInput = "";
            if ($scope.data.choice != "other" && $scope.data.choice != undefined) {
                $scope.data.userInput = "My dog needs " + $scope.data.choice;

            }
            if ($scope.data.post != undefined) {
                if ($scope.data.userInput != "") {
                    $scope.data.userInput = $scope.data.userInput + " ";
                }
                $scope.data.userInput = $scope.data.userInput + $scope.data.post;
            }

            if (($scope.data.choice == "other" || $scope.data.choice == undefined) && $scope.data.post == undefined) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'You need to select a choice or enter some text.'
                });
                alertPopup.then(function(res) {
                    console.log('Try select or enter again.');
                });
            } else {
                //console.log("data is ",$scope.data);
                $scope.showLoading($ionicLoading);

                var status = {
                    description: $scope.data.userInput,
                    likes: 0,
                    location: $scope.location //hard coded
                }
                var promise = StatusService.add($scope.user._id, status);

                promise.then(function(data, error) {
                        if (!error) {
                            console.log('added data is: ', data);
                            console.log('wish successfully added');
                            //$state.reload();
                            $state.go('app.myposts');

                        } else {
                            console.log('error adding wish');
                        }
                    }, function(response) {
                        console.log('response error ', response);
                    })
                    .finally(function($ionicLoading) {
                        //hide the loading
                        $scope.hideLoading($ionicLoading);
                    });
            }

        }

    })
    /*.controller('PetsNearbyCtrl', ['$scope', function ($scope) {
        
    }])
    */
    .controller('NewCommentCtrl', function($scope, $stateParams, StorageService, StatusService, $state, LocationService, $ionicPopup, $ionicLoading) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $scope.data = {};
        $scope.user = StorageService.getCurrentUser().user;


        $scope.addComment = function() {

            //      console.log("in add comment");

            //        $scope.data.comment = "";

            var userComment = $scope.data.comment;
            //        console.log("userComment message is");
            //        console.log(userComment);

            //console.log("data is ",$scope.data);
            //        $scope.showLoading($ionicLoading);

            var comment = {
                comment: userComment
            }

            var userID = $stateParams.userID;
            var statusID = $stateParams.statusID;

            //        console.log("scope userID is");
            //        console.log(userID, statusID);        

            var promise = StatusService.addComment(statusID, userID, comment);
            //        promise.then(function(data, error) {
            //            if (!error) {
            //                console.log('added data is: ', data);
            //                console.log('wish successfully added');
            //                //$state.reload();
            //                $state.go('app.myposts');
            //
            //            } else {
            //                console.log('error adding wish');
            //            }
            //        });

            promise.then(function(data, error) {
                if (data) {
                    //                $scope.user = data;
                    console.log('addcomment success');
                    $state.go('app.moments');
                }

            });
        }

    })

.controller('AboutCtrl', function($scope) {

})

;
