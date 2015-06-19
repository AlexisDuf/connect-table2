using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;


namespace APIYoutube
{
   public  class YoutubeApi
    {

        public const string APIKEY = "AIzaSyAHvLHZ-gVCU3VMt5YVyNBIyott9JjY5nU";

        public YoutubeApi()
        {
        }


        /// <summary>
        /// Searches the video, playlist and channel related with the nameSearch.
        /// </summary>
        /// <param name="nameSearch">The name search.</param>
        /// <param name="nbResult">The number of result (maximum 50).</param>
        /// <returns></returns>
        internal async Task<string> Search(string nameSearch, int nbResult)
        {
            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                ApiKey = APIKEY,
                ApplicationName = this.GetType().ToString()
            });

            var searchListRequest = youtubeService.Search.List("snippet");
            searchListRequest.Q = nameSearch;
            searchListRequest.MaxResults = nbResult;

            var searchListResponse = await searchListRequest.ExecuteAsync();

            List<YoutubeObject> objectYoutube = new List<YoutubeObject>();


            // Add each result to the appropriate list, and then display the lists of
            // matching videos, channels, and playlists.
            foreach (var searchResult in searchListResponse.Items)
            {
                switch (searchResult.Id.Kind)
                {
                    case "youtube#video":
                        objectYoutube.Add(new VideoYoutube(searchResult.Snippet.Title, 
                                                            searchResult.Id.VideoId, 
                                                            searchResult.Snippet.Thumbnails.Default.Url));
                        break;

                    case "youtube#channel":
                        objectYoutube.Add(new ChannelYoutube(searchResult.Snippet.Title,
                                                            searchResult.Id.ChannelId,
                                                            searchResult.Snippet.Thumbnails.Default.Url));
                        break;

                    case "youtube#playlist":
                        objectYoutube.Add(new PlaylistYoutube(searchResult.Snippet.Title,
                                                            searchResult.Id.PlaylistId,
                                                            searchResult.Snippet.Thumbnails.Default.Url));
                        break;
                }
            }

            return JsonConvert.SerializeObject(objectYoutube, Formatting.Indented);
        }

        /// <summary>
        /// Creates the new playlist.
        /// </summary>
        /// <param name="TitlePlaylist">The title of the playlist.</param>
        /// <param name="DescriptionPlaylist">The description of the playlist.</param>
        /// <param name="StatuePlaylist">Public or Private.</param>
        internal async Task CreateNewPlaylist(string TitlePlaylist, string DescriptionPlaylist, string StatuePlaylist)
        {
            UserCredential credential;
            using (var stream = new FileStream("client_secrets.json", FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    // This OAuth 2.0 access scope allows for full read/write access to the
                    // authenticated user's account.
                    new[] { YouTubeService.Scope.Youtube },
                    "user",
                    CancellationToken.None,
                    new Google.Apis.Util.Store.FileDataStore(this.GetType().ToString())
                );
            }

            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = this.GetType().ToString()
            });

            // Create a new, private playlist in the authorized user's channel.
            var newPlaylist = new Playlist();
            newPlaylist.Snippet = new PlaylistSnippet();
            newPlaylist.Snippet.Title = TitlePlaylist;
            newPlaylist.Snippet.Description = DescriptionPlaylist;
            newPlaylist.Status = new PlaylistStatus();
            newPlaylist.Status.PrivacyStatus = StatuePlaylist;
            newPlaylist = await youtubeService.Playlists.Insert(newPlaylist, "snippet,status").ExecuteAsync();

            Console.WriteLine("Playlist id {0} added.", newPlaylist.Id);
        }

        /// <summary>
        /// Gets all playlist of my account.
        /// </summary>
        /// <returns></returns>
        internal async Task<string> GetAllPlaylist()
        {

            UserCredential credential;
            using (var stream = new FileStream("client_secrets.json", FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    // This OAuth 2.0 access scope allows for full read/write access to the
                    // authenticated user's account.
                    new[] { YouTubeService.Scope.Youtube },
                    "user",
                    CancellationToken.None,
                    new Google.Apis.Util.Store.FileDataStore(this.GetType().ToString())
                );
            }

            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = this.GetType().ToString()
            });            

            var allPlaylist =  youtubeService.Playlists.List("snippet");
            allPlaylist.Mine = true;

            var playList = await allPlaylist.ExecuteAsync();
            List<PlaylistYoutube> playlistY = new List<PlaylistYoutube>();

            foreach (var item in playList.Items)
            {

                playlistY.Add(new PlaylistYoutube(item.Snippet.Title, item.Id, item.Snippet.Thumbnails.Default.Url));
            }

            return JsonConvert.SerializeObject(playlistY, Formatting.Indented);
        }

        /// <summary>
        /// Gets the id of the playlist by the name.
        /// </summary>
        /// <param name="name">The name of playlist.</param>
        /// <returns></returns>
        internal async Task<string> GetPlaylistByName(string name)
        {
            UserCredential credential;
            using (var stream = new FileStream("client_secrets.json", FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    // This OAuth 2.0 access scope allows for full read/write access to the
                    // authenticated user's account.
                    new[] { YouTubeService.Scope.Youtube },
                    "user",
                    CancellationToken.None, 
                    new Google.Apis.Util.Store.FileDataStore(this.GetType().ToString())
                );
            }

            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = this.GetType().ToString()
            });


            var allPlaylist = youtubeService.Playlists.List("snippet");
            allPlaylist.Mine = true;

            var playList = await allPlaylist.ExecuteAsync();

            foreach (var item in playList.Items)
            {
                if (item.Snippet.Title == name)
                {
                    Console.WriteLine("Playlist : {0}", item.Snippet.Title);
                    Console.WriteLine("Playlist Id : {0}", item.Id);
                    return JsonConvert.SerializeObject(new PlaylistYoutube(item.Snippet.Title, item.Snippet.Thumbnails.Default.Url, item.Id), Formatting.Indented); ;
                }
            }
            return "";
        }

        /// <summary>
        /// Not implemented yet. Adds the music to specific playlist.
        /// </summary>
        /// <param name="VideoId">The video identifier.</param>
        /// <param name="PlayListId">The play list identifier.</param>
        /// <returns></returns>
        internal async Task AddMusicToSpecificPlaylist(string VideoId, string PlayListName)
        {
            UserCredential credential;
            using (var stream = new FileStream("client_secrets.json", FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    // This OAuth 2.0 access scope allows for full read/write access to the
                    // authenticated user's account.
                    new[] { YouTubeService.Scope.Youtube },
                    "user",
                    CancellationToken.None,
                    new Google.Apis.Util.Store.FileDataStore(this.GetType().ToString())
                );
            }

            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = this.GetType().ToString()
            });

        }

        public static string callSearch(string nameSearch, int nbSearch)
        {
            YoutubeApi yout = new YoutubeApi();
            Task<string> youtTask = yout.Search(nameSearch, nbSearch);
            return youtTask.Result;
        }

        public static string callGetAllPlaylist()
        {
            YoutubeApi yout = new YoutubeApi();
            Task<string> youtTask = yout.GetAllPlaylist();
            return youtTask.Result;
        }

        public static string specificPlaylist(string nameVideo)
        {
            YoutubeApi yout = new YoutubeApi();
            Task<string> youtTask = yout.GetPlaylistByName(nameVideo);
            return youtTask.Result;
        }

        public static void callcreateNewPlaylist(string Title, string Description, string Statue)
        {
            YoutubeApi yout = new YoutubeApi();
            Task youtTask = yout.CreateNewPlaylist(Title, Description, Statue);            
        }

    }
}
