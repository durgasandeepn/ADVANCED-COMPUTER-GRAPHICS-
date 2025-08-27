/////////////////////////////////////////////////////////////////////////
// Pixel shader for lighting
////////////////////////////////////////////////////////////////////////
#version 330

out vec4 FragColor;

// These definitions agree with the ObjectIds enum in scene.h
const int     nullId	= 0;
const int     skyId	= 1;
const int     seaId	= 2;
const int     groundId	= 3;
const int     roomId	= 4;
const int     boxId	= 5;
const int     frameId	= 6;
const int     lPicId	= 7;
const int     rPicId	= 8;
const int     teapotId	= 9;
const int     spheresId	= 10;
const int     floorId	= 11;

in vec3 normalVec, lightVec,eyeVec;
in vec2 texCoord;

uniform int objectId;
uniform vec3 diffuse;

uniform vec3 specular;
uniform float shininess; 

uniform vec3 Light;    
uniform vec3 Ambient; 

const float Pi = 3.14159265;

vec3 BRDF,F;
float G,D;

void main()
{
    vec3 N = normalize(normalVec);
    vec3 L = normalize(lightVec);
	vec3 V = normalize(eyeVec);

	vec3 H = normalize(L+V);
	float LN = max(dot(L,N),0.0);
	float HN = max(dot(H,N),0.0);

    vec3 Kd = diffuse;   
	vec3 Ks = specular;

	vec3 Ii = Light;
	vec3 Ia = Ambient;
	float Alpha = shininess;
	
	//
    // A checkerboard pattern to break up large flat expanses.  Remove when using textures.
    if (objectId==groundId || objectId==floorId || objectId==seaId) {
        ivec2 uv = ivec2(floor(100.0*texCoord));
        if ((uv[0]+uv[1])%2==0)
            Kd *= 0.9; }
	
	//FragColor.xyz = vec3(0.5,0.5,0.5)*Kd + Kd*max(dot(L,N),0.0);
	
	
	D =	((Alpha + 2.0)/(2.0*Pi)) * pow((HN),Alpha);
	F = Ks + ((1,1,1) - Ks) * pow((1 - max(dot(H,L),0.0)),5);
	G = (1.0/(pow(max(dot(H,L),0.00001),2)));
	
	BRDF = (Kd/Pi) + (F * G * D)/4.0;
	
	
	FragColor.xyz = (Ia * Kd) + Ii*(LN)	*(BRDF);
	
	FragColor.w = 1.0;
}




