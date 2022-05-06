> **⚠ WARNING:**<br>
> The code in this project is no longer maintained.
> Use it with caution and check for vulnerabilities!

# CoFind

CoFind is a reseach oriented browser plugin that allows groups of users to solve web search tasks collaboratively.
The basic ideas and principles behind this research prototype can be found in our publication:

> Robert Fuhrmann, Anke Lehmann, Annett Mitschick, Ricardo Langner, and Raimund Dachselt. "CoFind: A Browser Plugin for Investigating Co-located Collaborative Web Search" in Mensch und Computer 2020 - Tagungsband (MuC ’20), September 06–09, 2020, Magdeburg, Germany. DOI [10.1145/3404983.3410012](https://doi.org/10.1145/3404983.3410012).

Key features: Activity sharing, shared view, sharing modi: auto;snapshot;explicit, cross-device support, logging, focus on research

**Questions**: If you have any questions or you want to give feedback, please
contact Robert Fuhrmann ([GitHub](https://github.com/rfuhrmann)),
 Anke Lehmann ([institutional website](https://imld.de/en/our-group/team/anke-lehmann/)),
 Annett Mitschick ([institutional website](https://imld.de/en/our-group/team/annett-mitschick/)),
 or Ricardo Langner ([GitHub](https://github.com/derric), [institutional website](https://imld.de/en/our-group/team/ricardo-langner/)).


## Prerequisites

Before you begin, ensure you have met the following requirements:

Client:
- Mozilla Firefox Version 66.0.5
- Non-restricted Wifi network

Server:
- Node v11.14.0
- Npm v6.9.0
- Express (npm)
- MongoDB v4.0.9
- Angular (optional: for editing admin view)
- Angular-devkit (optional: for editing admin view)


## Installing CoFind

To install CoFind, follow these steps:

Windows:
* Open server folder (includes index.js)
* open Windows PowerShell
* Install NPM
* Install express
```
npm i express
```

## Using CoFind

To use CoFind, follow these steps:
* Server
	* Open server folder (includes index.js)
	* Run index.js
```
node index.js
```
or
```
npm start
```

* Client
	* Open url in Firefox
```
about:debugging
```

	* Navigate "Dieser Firefox" -> "Temporäres Add-on laden"
	* Open extension folder
	* Open "manifest.json"


## Contribution

Thanks to the following people who contributed to the source code of this project:

* Robert Fuhrmann
* Hanna Blockwitz
* Lucas Vogel
