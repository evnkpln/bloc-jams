

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + ' <td class="song-item-title">' + songName + '</td>'
        + ' <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
        ;
    
    var $row = $(template);
    
    var clickHandler = function(){
        var songNumber = parseInt($(this).attr('data-song-number'));
    
        if (currentlyPlayingSongNumber === null) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        } else if (currentlyPlayingSongNumber === songNumber) {
            if(currentSoundFile.isPaused()){
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                $toggleButton.html(playerBarPauseButton);
            } else{
                
                $(this).html(playButtonTemplate);
                currentSoundFile.pause();
                $toggleButton.html(playerBarPlayButton);
            }
        } else {
            var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingSongElement.html(currentlyPlayingSongElement.attr('data-song-number'));
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        }
        
    };
    
    
    var onHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songNumber = parseInt(songItem.attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== songNumber) songItem.html(playButtonTemplate);
    };
    
    var offHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songNumber = parseInt(songItem.attr('data-song-number'));
             
        if(songNumber !== currentlyPlayingSongNumber) {
            songItem.html(songNumber);
        }
    };
 
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album){
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i< album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
}

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function() {
    getSongNumberCell(currentlyPlayingSongNumber).text(currentlyPlayingSongNumber);
    var newSong = (currentlyPlayingSongNumber === currentAlbum.songs.length) ? 1 : currentlyPlayingSongNumber + 1;
    setSong(newSong);
    updatePlayerBarSong();
    currentSoundFile.play();
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    
};

var previousSong = function(){
    getSongNumberCell(currentlyPlayingSongNumber).text(currentlyPlayingSongNumber);
    var newSong = (currentlyPlayingSongNumber === 1) ? currentAlbum.songs.length : currentlyPlayingSongNumber - 1;
    setSong(newSong);
    updatePlayerBarSong();
    currentSoundFile.play();
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    
};

var togglePlayFromPlayerBar = function () {
    if(currentSoundFile){
        if(currentSoundFile.isPaused()){
            $toggleButton.html(playerBarPauseButton);
            getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
            currentSoundFile.play();
        }else{
            $toggleButton.html(playerBarPlayButton);
            getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
            currentSoundFile.pause();
        }
    }
};

var updatePlayerBarSong = function() {
    if(currentSongFromAlbum === null) {
        $('.song-name').empty();
        $('.artist-name').empty();
        $('.artist-song-mobile').empty();
    }
    else{
        $('.song-name').html(currentSongFromAlbum.title);
        $('.artist-name').html(currentAlbum.artist);
        $('.artist-song-mobile').html(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    }
    $toggleButton.html(playerBarPauseButton);
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = (songNumber === null) ? null : currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $toggleButton = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $toggleButton.click(togglePlayFromPlayerBar);
});

