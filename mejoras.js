/* Eternals Roses — mejoras del catálogo
   Se carga con: <script src="mejoras.js"></script>
   - index.html: portada con estilo rosa + foto de anillos en la tarjeta de Joyería
   - joyeria.html: solo botón de WhatsApp, y envía la foto de la pieza elegida */
(function () {
  "use strict";

  var NUM = "50494221224";
  var IMG_JOYERIA = "anillos.jpg";
  var path = location.pathname.toLowerCase();
  var esJoyeria = path.indexOf("joyeria") > -1;

  /* ---------- utilidades ---------- */
  function addCSS(css) {
    var s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }

  function addFonts() {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@500;700&display=swap";
    document.head.appendChild(l);
  }

  function hojas(texto, raiz) {
    var out = [];
    (raiz || document).querySelectorAll("*").forEach(function (el) {
      if (el.children.length === 0 && el.textContent.trim() === texto) out.push(el);
    });
    return out;
  }

  /* ---------- PORTADA (index) ---------- */
  function portada() {
    addFonts();
    addCSS(
      ".er-hero{background:linear-gradient(180deg,#cf8590 0%,#c4727f 100%)!important;" +
        "text-align:center!important;padding:28px 18px 34px!important;" +
        "border-radius:0 0 34px 34px!important;box-shadow:0 12px 30px rgba(196,114,127,.35)!important;" +
        "margin-bottom:24px!important;border:none!important}" +
        ".er-hero img{border-radius:18px;box-shadow:0 8px 24px rgba(0,0,0,.28);max-width:100%;height:auto}" +
        ".er-hero,.er-hero *{color:#fff!important}" +
        ".er-tagline{font-family:'Great Vibes',cursive!important;font-size:2.3rem!important;" +
        "line-height:1.1!important;font-weight:400!important;margin:16px 0 6px!important;display:block}" +
        ".er-tile-img{width:100%;height:170px;object-fit:cover;border-radius:16px;" +
        "display:block;margin:0 0 10px 0;box-shadow:0 4px 14px rgba(196,114,127,.35)}"
    );

    /* Hero: contenedor del logo + frase + ubicación */
    var logo = document.querySelector("img[src*='logo']");
    if (logo) {
      var cur = logo.parentElement,
        hero = null;
      while (cur && cur !== document.body) {
        if (cur.textContent.indexOf("Ver catálogo completo") > -1) break;
        hero = cur;
        cur = cur.parentElement;
      }
      if (hero) hero.classList.add("er-hero");
    }

    /* Frase en cursiva (primera aparición = la de arriba) */
    var frase = hojas("Detalles que florecen para siempre")[0];
    if (frase) frase.classList.add("er-tagline");

    /* Tarjeta de Joyería con foto */
    var tarjeta = null;
    document.querySelectorAll("a").forEach(function (a) {
      if (!tarjeta && a.textContent.indexOf("Joyería y accesorios") > -1) tarjeta = a;
    });
    if (tarjeta) {
      hojas("💎", tarjeta).forEach(function (e) {
        e.style.display = "none";
      });
      var foto = document.createElement("img");
      foto.className = "er-tile-img";
      foto.src = IMG_JOYERIA;
      foto.alt = "Joyería y accesorios";
      tarjeta.insertBefore(foto, tarjeta.firstChild);
    }
  }

  /* ---------- JOYERÍA ---------- */
  function urlImagen(card) {
    var img = card.querySelector("img");
    if (img && (img.currentSrc || img.src)) return img.currentSrc || img.src;
    var els = card.querySelectorAll("*");
    for (var i = 0; i < els.length; i++) {
      var bg = getComputedStyle(els[i]).backgroundImage;
      var m = bg && bg.match(/url\(["']?(.*?)["']?\)/);
      if (m) return new URL(m[1], location.href).href;
    }
    return "";
  }

  function joyeria() {
    function ocultarPrecio() {
      hojas("Precio al privado").forEach(function (el) {
        el.style.display = "none";
      });
    }
    ocultarPrecio();
    new MutationObserver(ocultarPrecio).observe(document.body, {
      childList: true,
      subtree: true,
    });

    document.addEventListener("click", function (e) {
      var btn = e.target.closest("a,button");
      if (!btn || !/consultar por whatsapp/i.test(btn.textContent)) return;
      e.preventDefault();

      var card = btn.parentElement;
      while (card && card !== document.body && !card.querySelector("img") &&
             getComputedStyle(card).backgroundImage === "none") {
        card = card.parentElement;
      }
      var url = card ? urlImagen(card) : "";

      var msg =
        "Hola, me interesa esta pieza de Eternals Roses:" +
        (url ? "\n" + url : "") +
        "\n¿Me confirmas disponibilidad y precio?";
      window.open("https://wa.me/" + NUM + "?text=" + encodeURIComponent(msg), "_blank");
    });
  }

  /* ---------- arranque ---------- */
  function iniciar() {
    if (esJoyeria) joyeria();
    else if (/(\/|index\.html)$/.test(path)) portada();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
