import axios from 'axios';

import { APIModel, TranslatableAPIModel, PagesAPIModel, SnippetAPIModel } from './model.js';


class WagtailAPI {
	constructor(app, config) {
		this.config = config;
		this.app = app;
		this.$axios = axios.create({
			baseURL: this.config.wagtailURL + "/api/v2/"
		});

		this.pages = new PagesAPIModel("pages", this);
		this.documents = new APIModel("documents", this);
		this.images = new APIModel("images", this);
		this.blocks = new SnippetAPIModel("blocks", this);
		this.menus = new SnippetAPIModel("menus", this);
		this.settings = new APIModel("settings", this);
		this.form = new APIModel("forms", this);

		// setup pages endpoint
	}

	addSnippetEndpoint(name) {
		this[name] = new SnippetAPIModel(name, this);
	}
}


export default WagtailAPI;