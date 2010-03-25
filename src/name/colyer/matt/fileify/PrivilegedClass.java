package name.colyer.matt.fileify;

import java.lang.reflect.Method;
import java.security.AccessController;
import java.security.PrivilegedAction;

import org.json.JSONArray;
import org.json.JSONException;

/**
 * A class for running methods at an elevated execution level.
 * 
 * @author mcolyer
 * 
 */
public class PrivilegedClass {

    /**
     * Calls the given methodName on the given instance of the given class.
     * 
     * @param cls
     *            The class on which this method is to be found.
     * @param instance
     *            The instance on which this method is to be executed.
     * @param methodName
     *            The name of the method on this class to call, it can be either
     *            a class method or an instance method.
     * @param jsonArgs
     *            The JSON array containing the arguments for the function.
     * @param cbMethodName
     *            The name of the callback method in javascript. It must be
     *            accessible through the global scope.
     * @param ebMethodName
     *            The name of the callback method in javascript for errors. It
     *            must be accessible through the global scope.
     */
    @SuppressWarnings("unchecked")
    public static Object runPrivileged(Class cls, Object instance,
            String methodName, String jsonArgs) {
        // Parse the JSON Arguments
        final Object[] args;
        try {
            JSONArray array = new JSONArray(jsonArgs);
            args = new Object[array.length()];
            for (int i = 0; i < array.length(); i++) {
                args[i] = array.get(i);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }

        // Create Type array
        Class[] parameterTypes = new Class[args.length];
        int i = 0;
        for (Object arg : args) {
            parameterTypes[i++] = arg.getClass();
        }

        // Find the method
        final Method m;
        try {
            m = cls.getMethod(methodName, parameterTypes);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        final Object localizedInstance = instance;

        // Run privileged
        return AccessController.doPrivileged(new PrivilegedAction() {
            public Object run() {
                try {
                    return m.invoke(localizedInstance, args);
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }
            }
        });

    }
}
