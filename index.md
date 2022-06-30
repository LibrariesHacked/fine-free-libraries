---
title: Fine free libraries
---

> &ldquo;We believe that moving to a completely free loan service will encourage more people to use their local library while offering a service that’s fit for purpose.&rdquo;<br/>**Sarah Curran, Trafford Libraries**
<br/>
[New chapter for library borrowing](https://www.librariesconnected.org.uk/news/new-chapter-library-borrowing)

Fine free libraries is a project to promote libraries removing barriers to access and removing fines for overdue books.

{% include button.html text="Check your library service" link="/my-library" %}

<style>
#libraryhexmap { height: 600px; width: 100%; }
</style>


<div id="libraryhexmap"></div>


<script src="/assets/js/odi.hexmap.min.js"></script>

<script>

fetch('/assets/js/services.hexjson')
    .then(response => response.json())
    .then(hexdata => {
        hex = new ODI.hexmap(document.getElementById('hexmap1'),{
            'labels': { 'show': true },
            'hexjson': hexdata
        });
    });
    .catch(error => console.log(error));

</script>
