var WORKER = this;

function showMsgBox() {
	var lib = ctypes.open("C:\\WINDOWS\\system32\\user32.dll");

	/* Declare the signature of the function we are going to call */
	var msgBox = lib.declare("MessageBoxW",
							 ctypes.winapi_abi,
							 ctypes.int32_t,
							 ctypes.int32_t,
							 ctypes.jschar.ptr,
							 ctypes.jschar.ptr,
							 ctypes.int32_t);
	var MB_OK = 0;

	var ret = msgBox(0, "Hello world", "title", MB_OK);

	lib.close();
}

self.onmessage = function (msg) {
	console.error('incoming msg to worker:', msg.data);
	WORKER[msg.data[0]].apply(WORKER, msg.data.slice(1));
}