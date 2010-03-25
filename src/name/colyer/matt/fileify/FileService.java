package name.colyer.matt.fileify;

import java.applet.Applet;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;

import netscape.javascript.JSException;
import netscape.javascript.JSObject;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * A singleton which provides file operations to javascript through the
 * LiveConnect API.
 * 
 */
public class FileService extends Applet {
    private static final long serialVersionUID = -6352027113048671884L;
    private JSObject javascript = null;
    private boolean firstStart = true;

    @Override
    public void start() {
        /*
         * The firstStart boolean is required because when Safari switches tabs,
         * the stop is called whenever focus leaves and start is called whenever
         * focus is gained. Meanwhile Firefox doesn't do this. So in order to
         * emulate similar behavior across both we need to track whether start
         * has been previously called.
         */
        if (!firstStart)
            return;

        try {
            /*
             * The javascript bridge is connected here due to the fact that if
             * it's run in the init it freezes things on OS X. Again a
             * difference in how the java to javascript bridge is implemented
             * across platforms.
             */
            javascript = JSObject.getWindow(this);

            javascript.eval("applet_loaded_min()");
        } catch (JSException e) {
            System.err.println("The JS bridge couldn't be established");
        }
        firstStart = false;
    }

    /**
     * Enables Javascript calls to execute methods on this object with elevated
     * security privilege.
     * 
     * @param methodName
     *            The name of the desired method to be accessed.
     * @param jsonArgs
     *            A JSON array containing the arguments to pass to that
     *            function.
     * @return The return value of the function.
     */
    public Object runPrivileged(String methodName, String jsonArgs) {
        final Class<FileService> cls = FileService.class;
        return PrivilegedClass.runPrivileged(cls, this, methodName, jsonArgs);
    }

    /**
     * 
     * @param filename
     *            The full path of the filename to read.
     * @return A string containing all of the data in the file. If an error
     *         occurred an empty string is returned.
     * @throws JSONException
     */
    public String read(String filename) throws JSONException {
        JSONObject result = new JSONObject();

        try {
            BufferedReader reader = new BufferedReader(new FileReader(filename));
            StringBuffer target = new StringBuffer();
            String line = "";

            while ((line = reader.readLine()) != null) {
                target.append(line + "\n");
            }
            reader.close();
            result.put("data", target.substring(0, target.length()));
        } catch (FileNotFoundException e) {
            result.put("error", "File not found");
        } catch (IOException e) {
            result.put("error", "Error occurred while accessing the file");
        }
        return result.toString();
    }

    public String write(String filename, String content) throws JSONException {
        JSONObject result = new JSONObject();

        File f = new File(filename);
        FileOutputStream fs;
        try {
            fs = new FileOutputStream(f);
            DataOutputStream ds = new DataOutputStream(fs);
            ds.writeBytes(content);
            ds.close();
            fs.close();
        } catch (FileNotFoundException e) {
            result.put("error", "File not found");
        } catch (IOException e) {
            result.put("error", "Error occurred while accessing the file");
        }

        return result.toString();
    }
}
