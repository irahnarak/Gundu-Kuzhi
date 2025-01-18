function changeLanguage() {
    var language = document.getElementById("languageSelect").value;
    // Here you can either redirect or apply a translation
    window.location.href = "/help_set_language?lang=" + language;
}
window.onload = function () {
    // document.getElementById('help_cont').innerHTML = translations_help;

};

document.getElementById('languageSelect').value = lang;

