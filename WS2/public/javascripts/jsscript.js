/*
@function displays the loader and checks if a url has been entered
*/
function formSubmit()
{
    var loader = document.getElementById('loader');
    var url = document.getElementById('url_input');

    if(loader && url)
    {
      if(url.value.length != 0)
      {
        loader.style.display = 'block';
        return true;
      }
    }
    alert('L\'url n\'est pas valide.');
    return false;
};

/*
@function changes the Argus price according to the car version selected by the user
*/
function changeVersion()
{
  var selected = document.getElementById("versionChoice");
  var version = selected.options[selected.selectedIndex].innerHTML;
  var price = selected.value.substring(0, selected.value.indexOf('_'));
  var color = selected.value.substring(selected.value.indexOf('_')+1, selected.value.length);

  var argusPrice = document.getElementById("argusPrice");
  var adPrice = document.getElementById("adPrice");
  argusPrice.innerHTML = price + " &euro;";
  adPrice.className = "argus " + color;
}
