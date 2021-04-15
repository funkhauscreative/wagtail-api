

export class APIModel {
	constructor(modelType, $apiAdapter) {
		this.modelType = modelType;
		this.slug = modelType + "/";
		this.$apiAdapter = $apiAdapter;
		this.$axios = this.$apiAdapter.$axios;
	}

	async $get(path = '', localize = true) {
		if (localize && this.$apiAdapter.config.multilingual.enabled) {
			var url = new URL('https://placeholder.de' + this.slug + path);
			url.searchParams.append('locale', this.$apiAdapter.app.i18n.locale);
			return (await this.$axios.get(url.toString().replace('https://placeholder.de', ''))).data;
		} else {
			return (await this.$axios.get(this.slug + path)).data;
		}
	}

	async $post(id, data, headers) {
		return (await this.$axios.post(this.slug + id + "/", data, headers)).data;
	}

	$update(id, data, headers) {
		return this.$axios.update(this.slug + id + "/", data, headers);
	}

	$delete(id) {
		return this.$axios.delete(this.slug + id + "/")
	}
}

export class TranslatableAPIModel extends APIModel {
	async $getTranslationsOf($param) {
		return this.$get("?translation_of="+$param, false);
	}
}

export class PagesAPIModel extends TranslatableAPIModel {
	async $path(path, resolve = true) {
		
		let requestStr = "?absolute_path="+path;
		try {
			let pages = await this.$get(requestStr, false);

			if (pages.meta.total_count) {
				if (!resolve) {
					return page;
				}
				return this.$get(pages.items[0].id + "/", false);
			}

		} catch(error) {
			if (error.response.status == 400 || error.response.status == 404) {

				throw {
					data: "404 not found",
					url: path,
					status: 404
				}
			} else if (error.response.status == 301 || error.response.status == 302) {
				throw {
					data: error.response.data.detail,
					status: error.response.status
				};
			} else {
				throw {
					data: "500 Internal Server Error",
					url: path,
					status: 500
				};
			}
		}
	}


	async $getTranslationsOf($param) {
		// first check if only a page path or snippet name is reuested
		if (isNaN($param)) {
			var page = await this.$path($param);
			$param = page.id;
		}
		return super.$getTranslationsOf($param);
	}
}

export class SnippetAPIModel extends TranslatableAPIModel {
	async $name(path, resolve = true) {
		let requestStr = "?name="+path;
		let pages = await this.$get(requestStr);
		if (pages.meta.total_count) {
			return pages.items.find((item) => {
				return item.name == path;
			});
		} else {
			throw {
				data: "404 not found",
				url: path,
				status: 404
			};
		}
	}
}


export default APIModel;