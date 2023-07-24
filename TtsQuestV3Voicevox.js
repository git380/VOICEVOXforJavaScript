function play() {
    //話者と文字を受け取る
    var speakerId = document.getElementById('speakerSelect').selectedIndex;
    var text = document.getElementById('text').value;

    var audio = new TtsQuestV3Voicevox(speakerId, text);

    audio.play();
}

// Audioクラスを継承して新しいクラスTtsQuestV3Voicevoxを定義する
class TtsQuestV3Voicevox extends Audio {
    constructor(speakerId, text) {
        super(); // 親クラスのコンストラクターを呼び出す
        var params = {}; // リクエストパラメーターを格納
        params['key'] = 'Z4F4i255201_58n'; // APIキー
        params['speaker'] = speakerId; // 話者ID
        params['text'] = text; // 合成するテキスト
        const query = new URLSearchParams(params); // クエリ文字列を作成
        this.#main(this, query); // 音声合成のメソッド#mainを呼び出す
    }

    // 非公開メソッド#main - 音声合成リクエストをAPIに送信して音声を取得する
    #main(owner, query) {
        // 既にsrc属性に音声ファイルがセットされている場合は処理を中断する
        if (owner.src.length > 0) return;

        // APIのエンドポイントURLを指定
        var apiUrl = 'https://api.tts.quest/v3/voicevox/synthesis';

        // fetch関数を使って合成リクエストを送信し、レスポンスを処理する
        fetch(apiUrl + '?' + query.toString())
            .then(response => response.json())
            .then(response => {
                // isApiKeyValidの状態をHTMLに表示
                document.getElementById('status').textContent = JSON.stringify(response, null, 2);

                // レスポンスにretryAfter(待機時間(秒))が含まれている場合、APIリクエストが頻繁すぎるときは再試行する
                if (typeof response.retryAfter !== 'undefined') {
                    setTimeout(owner.#main, 1000 * (1 + response.retryAfter), owner, query);
                }
                // レスポンスにmp3StreamingUrlが含まれている場合、音声ファイルのURLをsrcにセットする
                else if (typeof response.mp3StreamingUrl !== 'undefined') {
                    owner.src = response.mp3StreamingUrl;
                }
                // レスポンスにerrorMessageが含まれている場合、エラーをスローする
                else if (typeof response.errorMessage !== 'undefined') {
                    throw new Error(response.errorMessage);
                }
                // 上記以外の場合、サーバーエラーとしてエラーをスローする
                else {
                    throw new Error("serverError");
                }
            });
    }
}
